class API::V1::RegistrationsController < Devise::RegistrationsController
  include ::RackSessionsFix
  respond_to :json

  def create
    @user = User.new(sign_up_params)
    
    if @user.save

      puts "######################################3CREANDO USUARIO......###################################\n"
      
      if address_params.present? && address_params.values.any?(&:present?)
        @country = Country.find_by(name: address_params[:country])
        
        if @country.nil?
          render json: { error: 'Country not found' }, status: :unprocessable_entity
          puts "PAIS NO EXISTE......"
          raise ActiveRecord::Rollback
        end

        real_address_params = address_params.except(:country).merge(user: @user, country_id: @country.id)
        @address = Address.new(real_address_params)

        # si es que no se puede guardar la direccion, se retorna un error
        unless @address.save!
          render json: { error: @address.errors.full_messages }, status: :unprocessable_entity
          puts "DIRECCION NO SE PUDO GUARDAR......"
          raise ActiveRecord::Rollback
        end

      end

      #render json: @user.id, status: :created

      render json: {
        status: {code: 200, message: 'Signed up successfully.'},
        data: UserSerializer.new(@user).serializable_hash[:data][:attributes]
      }

    else
      #render json: @user.errors, status: :unprocessable_entity
      render json: {
        status: {code: 401, message: "User couldn't be created successfully. #{@user.errors.full_messages.to_sentence}"}
      }, status: :unprocessable_entity
    end
  end

  private

  def sign_up_params
    params.require(:user).permit(
      :email, :first_name, :last_name, :handle,
      :password, :password_confirmation)
  end

  def address_params
    params.fetch(:address, {}).permit(:line1, :line2, :city, :country)
  end

  def respond_with(current_user, _opts = {})
    if resource.persisted?
      render json: {
        status: {code: 200, message: 'Signed up successfully.'},
        data: UserSerializer.new(current_user).serializable_hash[:data][:attributes]
      }
    else
      render json: {
        status: {code: 401,message: "User couldn't be created successfully. #{current_user.errors.full_messages.to_sentence}"}
      }, status: :unprocessable_entity
    end
  end
end
