require 'factory_bot_rails'

# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Initialize the review counter
ReviewCounter.create(count: 0)

if Rails.env.development?

  # Crear países
  countries = FactoryBot.create_list(:country, 5)

  # Crear cervecerías (breweries) con marcas (brands) y cervezas (beers)
  countries.map do |country|
    FactoryBot.create(:brewery_with_brands_with_beers, countries: [country])
  end

  # Crear usuarios con direcciones asociadas
  users = FactoryBot.create_list(:user, 10) do |user, i|
    user.address.update(country: countries.sample)
  end

  # Crear bares con direcciones y cervezas asociadas
  bars = FactoryBot.create_list(:bar, 5) do |bar|
    bar.address.update(country: countries.sample)
    bar.beers << Beer.all.sample(rand(1..3))
  end

  chile = Country.create(name: 'Chile')

  address = Address.create(
    line1: 'Av. Pdte. Kennedy 9001',
    line2: 'Local 3235',
    city: 'Las Condes',
    user: users.sample, # ermm xd 
    country: chile
  )

  eskibiritoiles = Bar.create(
    name: 'Eskibiri Toiles',
    latitude: '-33.390035084056386', 
    longitude: '-70.54683240607851',
    address: address
  )

  evento1 = Event.create(
    name: 'Celebración de 1 año sobrio en Alcohólicos Anónimos',
    description: 'Ven a celebrar con nosotros un año de sobriedad en el eskibiri bar. Habrá premios y sorpresas.',
    date: DateTime.new(2023, 12, 31, 20, 0, 0),
    bar: eskibiritoiles
  )
    
  # Crear eventos asociados a los bares
  events = bars.map do |bar|
    FactoryBot.create(:event, bar: bar)
  end

  # Crear relaciones de amistad entre usuarios
  users.combination(2).to_a.sample(5).each do |user_pair|
    FactoryBot.create(:friendship, user: user_pair[0], friend: user_pair[1], bar: bars.sample)
  end

  # Crear attendances (asistencia) de usuarios a eventos
  users.each do |user|
    events.sample(rand(1..3)).each do |event|
      FactoryBot.create(:attendance, user: user, event: event, checked_in: [true, false].sample)
    end
  end

  # Crear reviews de cervezas
  users.each do |user|
    Beer.all.sample(rand(1..3)).each do |beer|
      FactoryBot.create(:review, user: user, beer: beer)
    end
  end

end
