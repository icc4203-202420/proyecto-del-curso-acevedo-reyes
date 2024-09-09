module Authenticable
  extend ActiveSupport::Concern
  
  included do
    before_action :verify_jwt_token
  end

  private

  def verify_jwt_token
    authenticate_user!
    head :unauthorized unless current_user
  
    #if request.content_type = 'application/json'
    #  begin
      
    #    body = request.body.read
    #    @request_payload = JSON.parse(body) unless body.empty?
    #    params.merge!(@request_payload) if @request_payload
        
    #  rescue JSON::ParserError => e
    #    halt 400, { error: "Invalid JSON format #{e.message}" }.to_json
    #  end
    #end

    #response.headers['Access-Control-Allow-Origin'] = '*'
  end

=begin
  SECRET_KEY = "mysecretkey"

  #helpers do

    def encode_token(payload)
      JWT.encode(payload, SECRET_KEY, 'HS256')
    end

    def decode_token(token)
      JWT.decode(token, SECRET_KEY, true, { algorithm: 'HS256' })[0] #quizas esto esta mal
    rescue
      nil
    end

    def authorized_user
      auth_header = request.env['HTTP_AUTHORIZATION']
      token = auth_header.split(' ').last if auth_header
      decoded_token = decode_token(token)

      if decoded_token
        email = decoded_token['sub']
        @user = User.find_by(email: email)
        #USERS[email]
      end
    end

    def authorized?
      !!authorized_user
    end

    def protected!
      halt 401, { message: 'Access Denied' }.to_json unless authorized?
    end

  #end

  # POST /api/v1/login
  def LogIn
    user = User.find_by(email: params[:email])

    if user && user.authenticate(params[:password]) #puede que authenticate no sea el metodo correcto
      payload = { handle: user.handle, sub: user.email, exp: (Time.now.to_i + 60 * 60).to_i } #una hora de expiracion
      token = encode_token(payload)
      { token: token }.to_json
    else
      halt 401, { message: 'Invalid credentials' }.to_json
    end
  end

  # GET /api/v1/logout
  def LogOut
    200
  end

  # POST /api/v1/signup
  def SignUp
    user = User.new(params[:user])
    if user.save
      payload = { handle: user.handle, sub: user.email, exp: (Time.now.to_i + 60 * 60).to_i } #una hora de expiracion
      token = encode_token(payload)
      { token: token }.to_json
    else
      halt 401, { message: 'Invalid credentials' }.to_json
    end
  end

  def verify_token
    protected!
    200
  end
=end

end