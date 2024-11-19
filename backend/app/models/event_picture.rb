class EventPicture < ApplicationRecord
  
  belongs_to :event
  belongs_to :user

  #after_create_commit :broadcast_to_friends

  has_one_attached :image
  
  #def broadcast_to_friends

    #bar = event.bar

    #puts "MANDANDO IMAGEN A AMIGOS DE USUARIO: #{user.handle}"

    
  #end
end
