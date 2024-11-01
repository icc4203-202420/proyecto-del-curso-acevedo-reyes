class API::V1::PushTokensController < ApplicationController
  respond_to :json
  #before_action :verify_jwt_token, only: [:create, :update, :destroy]
  before_action :authenticate_user!, except: [:index]

  # GET /api/v1/users/:user_id/push_tokens
  #def index
    #push_tokens = current_user.push_tokens
  #  push_tokens = PushToken.all
  #  render json: push_tokens, status: :ok
  #end

  # POST /api/v1/push_tokens
  def create
    token = params[:token]
    
    # Verifica si el token ya existe para evitar duplicados
    existing_token = current_user.push_tokens.find_by(token: token)
    
    if existing_token
      render json: { message: 'Token ya registrado' }, status: :ok
    else
      push_token = current_user.push_tokens.new(token: token)

      if push_token.save
        render json: { message: 'Push token registrado con éxito' }, status: :created
      else
        render json: { error: 'No se pudo registrar el push token' }, status: :unprocessable_entity
      end
    end
  end
end