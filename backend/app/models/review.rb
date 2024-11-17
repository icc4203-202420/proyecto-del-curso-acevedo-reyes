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

    user.friends.each do |friend|
      ActionCable.server.broadcast("feed_#{friend.id}", {
        review_id: self.id,        #para identificar la reseña en el front
        review_rating: self.rating,
        beer_id: beer.id,
        beer_name: beer.name,
        user_handle: user.handle    #del usuario que envio la reseña
      })
    end
  end 

end
