Rails.application.routes.draw do
  # devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  get 'current_user', to: 'current_user#index'
  
  devise_for :users, path: '', path_names: {
    sign_in: 'api/v1/login',
    sign_out: 'api/v1/logout',
    registration: 'api/v1/signup'
  },
  controllers: {
    sessions: 'api/v1/sessions',
    registrations: 'api/v1/registrations'
  }

  # ermm
  mount ActionCable.server => '/cable'

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :bars
      resources :beers
      resources :events, only: [:index, :show]
      resources :attendances, only: [:index, :create]
      resources :event_pictures, only: [:index, :create, :destroy]

      get 'bars/:bar_id/events', to: 'events#bars_events_index'
      get 'beers/:id/bars', to: 'beers#bars'
      get 'users/:id/friendships', to: 'users#friendships'
      get 'events/:id/event_pictures', to: 'event_pictures#event_index'
      #get 'users/:id/push_tokens', to: 'push_tokens#index'
      post 'push_tokens', to: 'push_tokens#create'

      resources :users do
        resources :reviews, only: [:index]
        post 'friendships', to: 'users#create_friendship'
      end
     
      resources :friendships, only: [:create]

      resources :reviews, only: [:index, :show, :create, :update, :destroy]
    end
  end

end
