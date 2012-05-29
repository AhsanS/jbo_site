# main.rb
# Website for JBO Landscaping
# May 2012
# © Higgs Systems 2012

require 'sinatra'
require 'haml'
# require 'dm-core'
# require 'dm-validations'
# require 'logger'
require 'pony'

# require 'bundler'
# Bundler.require

set :pages, %w[about contact]

# get('/styles.css'){ content_type 'text/css', :charset => 'utf-8' ; scss :styles }

helpers do  
    include Rack::Utils  
    alias_method :h, :escape_html  
end

configure do
  set :globalvar1, ''
end


get '/' do
  @title='home'
  haml :index
end

settings.pages.each do |page|
  get '/'+"#{page}" do
    @title = page
    haml :"#{page}"
  end
end



post '/' do 
  begin
    Pony.mail(
      from:        params[:name] + "<" + params[:email] + ">",
      to:          'ahsan@sharafuddin.com',
      subject:     params[:name] + " has contacted you",
      body:        params[:message] + "\n\n" + params[:name] + "\n" + params[:phone],
      port:        '587',
      via:         :smtp,
      via_options: { 
        address:              'smtp.1and1.com', 
        port:                 '587', 
        enable_starttls_auto: true, 
        user_name:            'ahsan@sharafuddin.com', 
        password:             'hotmail1', 
        authentication:       :plain, 
        domain:               'sharafuddin.com'
      }
    )
  rescue
    "Error!"
  end
    "Sucess!"
  redirect '/' 
end


# post '/' do 
#   begin
#     Pony.mail(
#       :from => params[:name] + "<" + params[:email] + ">",
#       # :from => 'Ahsan Sharafuddin' + "<" + 'ahsan@sharafuddin.com' + ">",
#       :to => 'ahsan@sharafuddin.com',
#       :subject => params[:name] + " has contacted you",
#       :body => params[:message] + "\n\n" + params[:name] + "\n" + params[:phone],
#       # :body => 'Hi!',
#       :port => '587',
#       :via => :smtp,
#       :via_options => { 
#         :address              => 'smtp.1and1.com', 
#         :port                 => '587', 
#         :enable_starttls_auto => true, 
#         :user_name            => 'ahsan@sharafuddin.com', 
#         :password             => 'hotmail1', 
#         :authentication       => :plain, 
#         :domain               => 'sharafuddin.com'
#       })
#   rescue
#     "Error!"
#   end
#     "Sucess!"
# #   redirect '/' 
# end

