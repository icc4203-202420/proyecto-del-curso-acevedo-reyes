class API::V1::PushTokensController < ApplicationController
  #include Authenticable
  
  respond_to :json
  #before_action :verify_jwt_token, except: [:index]
  #before_action :authenticate_user!, except: [:index]

  # GET /api/v1/push_tokens
  def index
    #push_tokens = current_user.push_tokens
    push_tokens = PushToken.all
    render json: push_tokens, status: :ok
  end

  # POST /api/v1/push_tokens
  def create
    token = params[:token]
    user_id = params[:user_id]
    @user = User.find(user_id)
    
    puts "PushToken: #{token}"
    puts "User: #{@user}"

    # Verifica si el token ya existe para evitar duplicados
    existing_token = @user.push_tokens.find_by(token: token)
    
    if existing_token
      puts "Token ya registrado"
      render json: { message: 'Token ya registrado' }, status: :ok
    else
      push_token = @user.push_tokens.new(token: token)

      if push_token.save
        render json: { message: 'Push token registrado con éxito' }, status: :created
      else
        render json: { error: 'No se pudo registrar el push token' }, status: :unprocessable_entity
      end
    end
  end
end