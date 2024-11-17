class FeedChannel < ApplicationCable::Channel
  def subscribed
    @user = User.find(params[:user_id])
    stream_from "feed_#{@user.id}" #del usuario actual
    Rails.logger.info("Suscripción exitosa al canal feed_#{@user.id}")
  end

  def unsubscribed
    Rails.logger.info("Desuscripción del canal feed_#{params[:user_id]}")
    # Any cleanup needed when channel is unsubscribed
  end

  def received(data)
    Rails.logger.info("Mensaje recibido en el canal: #{data.inspect}")
  end
end
