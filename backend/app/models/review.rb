class Review < ApplicationRecord
  belongs_to :user
  belongs_to :beer

  after_save :update_beer_rating
  after_destroy :update_beer_rating

  after_create_commit :broadcast_to_friends # o after save nosexd

  private

  def update_beer_rating
    beer.update_avg_rating
  end

  def broadcast_to_friends

    bar_of_beer = beer.bars.sample || nil
    address = bar_of_beer.address if bar_of_beer.present?

    user.friends.each do |friend|
      ActionCable.server.broadcast("feed_#{friend.id}", 
      {
        review_id: self.id,        # para identificar la reseña en el front
        review_created_at: self.created_at,
        review_rating: self.rating,
        
        beer_avg_rating: beer.avg_rating,
        beer_name: beer.name,

        bar_id: bar_of_beer.id || nil,            # para el boton de ver bar
        bar_name: bar_of_beer.name || nil,
        bar_country: address.country.name || nil,
        bar_line1: address.line1 || nil,
        bar_line2: address.line2 || nil,
        bar_city: address.city || nil,

        user_handle: user.handle    # del usuario que envio la reseña
      })
    end
  end 

end
