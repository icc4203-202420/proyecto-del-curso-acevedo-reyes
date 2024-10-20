class API::V1::BeersController < ApplicationController
  include ImageProcessing
  include Authenticable

  respond_to :json
  before_action :set_beer, only: [:show, :update, :destroy, :bars]
  before_action :verify_jwt_token, only: [:create, :update, :destroy]

  # GET /beers
  def index
    @beers = Beer.includes(brand: :brewery).all
    render json: {
      beers: @beers.as_json(include: {
        brand: {
          include: { brewery: { only: [:id, :name] } },
          only: [:id, :name]
        }
      })
    }, status: :ok
  end

  # GET /beers/:id
  def show
    if @beer.image.attached?
      render json: @beer.as_json(include: {
        brand: {
          include: { brewery: { only: [:id, :name] } },
          only: [:id, :name]
        },
        reviews: {
          include: { 
            user: { only: [:id, :handle] }
          },
          only: [:id, :text, :rating, :created_at]
        }
      }).merge({
        image_url: url_for(@beer.image),
        thumbnail_url: url_for(@beer.thumbnail)
      }),
      status: :ok
    else
      render json: {
        beer: @beer.as_json(include: {
          brand: {
            include: { brewery: { only: [:id, :name] } },
            only: [:id, :name]
          },
          reviews: {
            include: { 
              user: { only: [:id, :handle] }
            },
            only: [:id, :text, :rating, :created_at]
          }
        })
      }, status: :ok
    end
  end

  # GET /beers/:id/bars
  def bars
    @beer = Beer.find_by(id: params[:id])
    puts "AAAAAAAAAAAAAAAAAAa: #{@beer}"
    if @beer
      @bars = @beer.bars
      render json: { bars: @bars }, status: :ok
    else
      render json: { error: 'Beer not found' }, status: :not_found
    end
  end


  # POST /beers
  def create
    @beer = Beer.new(beer_params.except(:image_base64))
    handle_image_attachment if beer_params[:image_base64]

    if @beer.save
      render json: { beer: @beer, message: 'Beer created successfully.' }, status: :created
    else
      render json: @beer.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /beers/:id
  def update
    handle_image_attachment if beer_params[:image_base64]

    if @beer.update(beer_params.except(:image_base64))
      render json: { beer: @beer, message: 'Beer updated successfully.' }, status: :ok
    else
      render json: @beer.errors, status: :unprocessable_entity
    end
  end

  # DELETE /beers/:id
  def destroy
    @beer.destroy
    head :no_content
  end

  private

  def set_beer
    @beer = Beer.find_by(id: params[:id])
    render json: { error: 'Beer not found' }, status: :not_found if @beer.nil?
  end  

  def beer_params
    params.require(:beer).permit(:name, :beer_type, 
      :style, :hop, :yeast, :malts, 
      :ibu, :alcohol, :blg, :brand_id, :avg_rating,
      :image_base64)
  end

  def handle_image_attachment
    decoded_image = decode_image(beer_params[:image_base64])
    @beer.image.attach(io: decoded_image[:io], 
      filename: decoded_image[:filename], 
      content_type: decoded_image[:content_type])
  end 
  
  def verify_jwt_token
    authenticate_user!
    head :unauthorized unless current_user
  end  
end
