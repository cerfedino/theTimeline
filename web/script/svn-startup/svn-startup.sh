# run this script in the form:
# bash svn-startup your-username

username=$1

svn checkout svn+ssh://$username@atelier.inf.usi.ch/home/prendg/svn/sa-project/web

#there will be another script which is like a menu
#created by Gerald Prendi
