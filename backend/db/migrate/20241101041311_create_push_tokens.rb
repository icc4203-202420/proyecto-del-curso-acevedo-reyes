class CreatePushTokens < ActiveRecord::Migration[7.1]
  def change
    create_table :push_tokens do |t|
      t.references :user, null: false, foreign_key: true#, unique: true
      t.string :token, null: false

      t.timestamps
    end

    #add_index :push_tokens, :token, unique: true #para evitar duplicidad, pero si deberia ser psible que un usuario tenga varios tokens
  end
end
