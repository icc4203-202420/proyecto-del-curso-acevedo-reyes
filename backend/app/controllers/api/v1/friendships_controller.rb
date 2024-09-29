class API::V1::FriendshipsController < ApplicationController
    before_action :authenticate_user!  # Asumiendo que estás usando Devise para la autenticación
  
    def create
      puts("LLAMANDO A FRIENDSHIP CONTROLER?!")
      # Obtener el usuario activo y el usuario de la vista
      @user = current_user  # Devise te permite acceder al usuario actual con current_user
      @friend = User.find(params[:friend_id])
      @bar = Bar.find(params[:bar_id])  # Bar donde se conocieron (desde el autocomplete)
  
      # Crear una nueva amistad
      friendship = @user.friendships.build(friend: @friend, bar: @bar)
  
      if friendship.save
        render json: { message: "Amistad creada con éxito." }, status: :created
      else
        render json: { errors: friendship.errors.full_messages }, status: :unprocessable_entity
      end
    end
  end
  