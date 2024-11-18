require_relative Rails.root.join('app/services/push_notification_service').to_s

class API::V1::AttendancesController < ApplicationController
  #include Authenticable

  respond_to :json
  #before_action :verify_jwt_token, only: [:create]
  def test
    render json: { message: "Attendance endpoint is accessible" }, status: :ok
  end
  
  # GET /api/v1/attendances
  def index
    puts("Calling INDEX")
    @attendances = Attendance.all
    render json: { attendances: @attendances }, status: :ok
  end

  # POST /api/v1/attendances
  def create
    puts("Calling create!")
    @attendance = Attendance.new(attendance_params)
    if @attendance.save
      render json: { attendance: @attendance, message: 'Attendance created successfully.' }, status: :ok

      PushNotificationService.notify_friends_about_check_in(@attendance.user, @attendance.event)

    else
      render json: @attendance.errors, status: :unprocessable_entity
    end
  end

  private

  def attendance_params
    params.require(:attendance).permit(:user_id, :event_id, :checked_in)
  end
  

end
