require_relative Rails.root.join('app/services/push_notification_service').to_s

class API::V1::UsersController < ApplicationController
  respond_to :json
  before_action :set_user, only: [:update, :friendships, :create_friendship] 
  #before_action :verify_jwt_token, only: [:create, :update, :destroy]
  
  def index
    @users = User.all
    render json: { 
      users: @users.as_json(only: [:id, :first_name, :last_name, :email, :handle]) 
    }, status: :ok
  end

  def show
    @user = User.find_by(id: params[:id])
    puts("USER:",@user.inspect)
    events = Attendance.where(user_id: @user.id)
    bars = []

    if events.nil?
      bars << "No events assistance was found for this user."
    else
      puts("ATTENDANCES: ", @events.inspect)
      events.each do |attendance|
      puts("DEBUGGING FOR", attendance.event_id)
      barname = Bar.find_by(id: attendance.event_id)
      
      if barname.nil?
        puts("NOT FOUND ANY BAR")
      else
        puts("FOUND BAR:", barname.name)
        bars << barname.name
      
      end
    end
  end
    puts("VARIABLE BARS:", bars)
    if @user
      render json: { 
        user: @user.as_json(only: [:id, :first_name, :last_name, :email, :handle]).merge(bars: bars, push_tokens: @user.push_tokens)
      }, status: :ok
    else
      render json: { error: 'User not found' }, status: :not_found
    end
  end

  # GET /api/v1/users/:id/friendships: retorna una lista de todas los user que son amigos segun el modelo Friendship
  def friendships
    puts("LLAMANDO A USER CONTROLER?!!!!")
    puts("WOW")
    #@user = User.find(params[:id])
    @friends = @user.friends
    puts @friends
    render json: { friends: @friends }, status: :ok
  end

  # POST /api/v1/users/:id/friendships: crea una nueva amistad entre dos usuarios
  def create_friendship
    puts("LLAMANDO A USER CONTROLER?!")
    puts("Debugging general params:")
    puts(params.inspect)
    puts("Debugging user!!")
    # @user = User.find(params[:id]) YA VIENE DE SET USER
    puts(@user.inspect)
    puts("Debugging friend:")
    @friend = User.find(params[:friend_id])
    puts(@friend.inspect)
    puts("Debugging bar:")
    @bar = Bar.find(params[:bar_id])
    puts(@bar.inspect)
    @friendship = Friendship.find_by(user: @user, friend: @friend)
    puts("SEARCHED FOR FRIENDSHIP, result: ", @friendship)
    
    if @friendship.nil?
      puts("BAR FOUND!", @bar.inspect)
      @friendship1 = Friendship.new(user: @user, friend: @friend, bar: @bar)
      @friendship2 = Friendship.new(user: @friend, friend: @user, bar: @bar)
      if @friendship1.save && @friendship2.save
        render json: { message: 'Friendship created successfully.' }, status: :ok
        puts "LLAMANDO A PUSH NOTIFICATION SERVICE!!!!!!!!!"
        
        PushNotificationService.notify_user_about_friendship(@user, @friend)
        #PushNotificationService.notify_user_about_friendship(@friend, @user)
      else
        render json: @friendship.errors, status: :unprocessable_entity
      end
    else
      puts("YA SOS AMIGO!!")
      render json: { message: 'You are already friends with this fella!!' }, status: :unprocessable_entity
    
    end
  end

  def create
    @user = User.new(user_params)
    if @user.save
      render json: @user.id, status: :ok
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def update
    #byebug
    if @user.update(user_params)
      render :show, status: :ok, location: api_v1_users_path(@user)
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  private

  def set_user
    puts("CALLING SET USER")
    puts(params.inspect)
    if params[:user_id] == ":id"
      params[:id] = params[:user].to_i
      puts("UPDATING PARAMS")
    end
    puts("ACTUAL PARAMS:")
    puts(params.inspect)
    puts("The user is:")
    puts(params[:user_id])
    if params[:user_id].nil?
      @user = User.find(params[:id])
    else
      @user = User.find(params[:user_id])
    end
    puts @user
    puts("Fin de set_user")
  end

  def user_params
    params.fetch(:user, {}).
        permit(:id, :first_name, :last_name, :email, :age,
            { address_attributes: [:id, :line1, :line2, :city, :country, :country_id, 
              country_attributes: [:id, :name]],
              reviews_attributes: [:id, :text, :rating, :beer_id, :_destroy]
            })
  end
end
