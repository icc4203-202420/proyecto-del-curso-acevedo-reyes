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
        user: @user.as_json(only: [:id, :first_name, :last_name, :email, :handle]).merge(bars: bars)
      }, status: :ok
    else
      render json: { error: 'User not found' }, status: :not_found
    end
  end

  # GET /api/v1/users/:id/friendships: retorna una lista de todas los user que son amigos segun el modelo Friendship
  def friendships
    puts("LLAMANDO A USER CONTROLER?!")
    #@user = User.find(params[:id])
    @friends = @user.friends
    render json: { friends: @friends }, status: :ok
  end

  # POST /api/v1/users/:id/friendships: crea una nueva amistad entre dos usuarios
  def create_friendship
    puts("LLAMANDO A USER CONTROLER?!")
    @user = User.find(params[:id])
    @friend = User.find(params[:friend_id])
    @bar = Bar.find_by(name: params[:bar_id])
    @friendship = Friendship.find_by(user: @user, friend: @friend)
    puts("SEARCHED FOR FRIENDSHIP, result: ", @friendship)
    if @friendship.nil?
      puts("BAR FOUND!", @bar.inspect)
      @friendship = Friendship.new(user: @user, friend: @friend, bar: @bar)
      
      if @friendship.save
        render json: { message: 'Friendship created successfully.' }, status: :ok
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
    @user = User.find(params[:id])
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
