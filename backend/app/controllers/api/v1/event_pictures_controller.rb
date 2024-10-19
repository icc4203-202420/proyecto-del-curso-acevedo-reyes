class API::V1::EventPicturesController < ApplicationController
  include ImageProcessing
  include Authenticable

  respond_to :json

  before_action :set_event_picture, only: [:destroy]
  before_action :verify_jwt_token, except: [:index, :event_index]

  # GET /api/v1/event_pictures
  def index
    @event_pictures = EventPicture.all
    render json: { event_pictures: @event_pictures }, status: :ok
  end

  # GET /api/v1/events/:id/event_pictures
  def event_index
    
    @event = Event.find(params[:id])
    @event_pictures = @event.event_pictures

    event_pictures_with_images = @event_pictures.map do |picture|
      picture.as_json.merge(image_url: url_for(picture.image)) if picture.image.attached?
    end

    render json: { event: @event, event_pictures: event_pictures_with_images }, status: :ok
  end

  # POST /api/v1/event_pictures
  def create
    @event_picture = EventPicture.new(event_picture_params.except(:image_base64))
    
    if handle_image_attachment && @event_picture.save
      render json: { event_picture: @event_picture, message: 'Imagen subida correctamente.' }, status: :ok
    else
      render json: @event_picture.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/event_pictures/:id
  def destroy
    if @event_picture.destroy
      render json: { message: 'Event picture deleted successfully.' }, status: :ok
    else
      render json: @event_picture.errors, status: :unprocessable_entity
    end
  end

  private

  def set_event_picture
    @event_picture = EventPicture.find(params[:id])
  end

  def event_picture_params
    params.require(:event_picture).permit(:event_id, :user_id, :description, :image_base64)
  end

  def handle_image_attachment
    image_data = params[:event_picture][:image_base64]

    if image_data.present?
      decoded_image = decode_image(image_data) # Decodificar la imagen usando el módulo
      return false unless decoded_image

      @event_picture.image.attach(
        io: decoded_image[:io],
        filename: decoded_image[:filename],
        content_type: decoded_image[:content_type]
      )
    end
    
    true
  end
end