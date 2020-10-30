#!/bin/sh

#This script is created and is under copyright of Gerald Prendi and Group1 of Software Atelier 2020 USI
#If you wish to make changes do them at your own harm, I take no responsibility it breaks your computer as a result of your own actions
 

read -p $(tput setaf 2)"                 CAREFULLY READ THIS
This installer will install the 'svn-menu' command, 
svn-menu is accessible anywhere in your pc, but it operates only in a svn repository
the main sript of the menu is accessible in pub/web/script/svn-menu/ but you won't need to use it manually
you must run installer script in the pub directory or else it will not work
This is a one-time process. You don't need to run the installer again and it will be deleted from the main folder after you all have installed your copy
$(tput setaf 7)
The installation is starting. Continue? [Y/N] " answer

terminate(){
echo "The process was terminated by the user, the svn-menu was not installed" 
}


#installs the svn-menu command from the script
install_menu(){
#records the current working directory
 current=$(pwd)

#menu script location
 menu=$current/web/script/svn-menu/svn-control.sh

#makes the menu script executable
 chmod +x $menu 2> /dev/null || echo "
$(tput setaf 1)Couldn't make the menu script executable.
Try to manually make it executable by using the command: 
$(tput setaf 3)chmod +x $(pwd)/web/script/svn-menu/svn-control.sh
"$(tput setaf 7)

#creates the command at bashrc
 echo "alias svn-menu='bash $menu $username'" >> ~/.bashrc && echo "The installation SUCCEEDED, try the new command, by entering 'svn-menu' in terminal"
 source ~/.bashrc
}


#case handler

case $answer in
        'y')   install_menu ;;
        "Y")   install_menu ;;
        'yes') install_menu ;;
        "Yes") install_menu ;; 
        "YES") install_menu ;;
        "n")   terminate ;;
        "no")  terminate ;;
        "N")   terminate ;; 
        "No")  terminate ;;
        "NO")  terminate ;;
        *) echo "Not a valid Option";;
    esac
        



