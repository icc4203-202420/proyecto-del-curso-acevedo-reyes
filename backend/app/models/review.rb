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

    bar = beer.bars.sample || nil #puede que no existan bares
    bar_id = bar.id if bar.present? 
    bar_name = bar.name if bar.present? 
    address = bar.address if bar.present? 
    bar_country = address.country.name if address.present? 
    bar_line1 = address.line1 if address.present? 
    bar_line2 = address.line2 if address.present? 
    bar_city = address.city if address.present? 
    
    user.friends.each do |friend|
      ActionCable.server.broadcast("feed_#{friend.id}", 
      {
        review_id: self.id,        # para identificar la reseña en el front
        review_created_at: self.created_at,
        review_rating: self.rating,
        
        beer_avg_rating: beer.avg_rating,
        beer_name: beer.name,

        bar_id: bar_id,            # para el boton de ver bar
        bar_name: bar_name,
        bar_country: bar_country,
        bar_line1: bar_line1,
        bar_line2: bar_line2,
        bar_city: bar_city,

        user_handle: user.handle    # del usuario que envio la reseña
      })
    end

    ActionCable.server.broadcast("feed_#{user.id}", 
      {
        review_id: self.id,        # para identificar la reseña en el front
        review_created_at: self.created_at,
        review_rating: self.rating,
        
        beer_avg_rating: beer.avg_rating,
        beer_name: beer.name,

        bar_id: bar_id,            # para el boton de ver bar
        bar_name: bar_name,
        bar_country: bar_country,
        bar_line1: bar_line1,
        bar_line2: bar_line2,
        bar_city: bar_city,

        user_handle: user.handle    # del usuario que envio la reseña
      })
  end 

end
