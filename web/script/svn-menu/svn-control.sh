#!/bin/sh

#This script is created and is under copyright of Gerald Prendi and Group1 of Software Atelier 2020 USI
#If you wish to make changes do them at your own harm, I take no responsibility it breaks your computer as a result of your own actions


#make this sript executable
# chmod u+x svn-control.sh
#execute this with:   
# bash svn-control.sh 
#this function is in interactive control of the svn-client
#get access at it by inputting your username 

#user defined variables, change only the student names array
read -p "Enter your username: " username  
     if [ $username ]   #this guarantees that the argument wont be empty
        then
 
 
 #the student names array, CHANGE ONLY THIS accordingly
allStudents=(artusa benama benede beninn biasim cagnaa moraic cattak cerfea corecs costafr cravia dipiee desteg faucoa geldea gelmad ibaner jelmim lazarb morarl morgaa muhizn padovr prendg savoil soresf taneva vescim)


# the total number of students
nr_students=${#allStudents[@]}



#function definition
     #menu function, outputs the list of operations you could perform and asks for the user choice
menu (){
echo "
$(tput setaf 3)  
++++++++++++++++++++++++++++++++SVN-CLIENT+++++++++++++++++++++++++++++++++
+ Input [1] to CHECKOUT the working copy                                  + 
+ Input [2] to UPDATE the working copy                                    +   
+ Input [3] to VIEW Local Logs                                            +     
+ Input [4] to VIEW Remote Logs                                           +         
+ Input [5] to ADD files to repository [file-name or *(all)]              +
+ Input [6] to commit                                                     +   
+ Input [7] to delete files                                               + 
+ Input [8] to ignore folders from commiting                              +
+ Input [9] to view the status of the files in your local repository      +  
+ Input [q] to end                                                        +  
+ Enter what operation you want to perform: [1/2/3/4/5/6/7/q] ?           +
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
" 
read -p "Your choice: $(tput setaf 7)" user_choice
} #tput setaf Number is a command used to change the color of the output

       #checks out the repository from the main svn server
checkout_repo (){
  	svn checkout svn+ssh://$username@atelier.inf.usi.ch/home/prendg/svn/sa-project/pub/
  	cd test
}
       #updates the working directory
update_repo(){
  	svn update
}

         # prints the local logs
local_logs(){
	 svn log
}

       # prints the full remote logs
remote_logs(){
 	svn log svn+ssh://$username@atelier.inf.usi.ch/home/prendg/svn/sa-project/pub/
}

       # adds file to the local repo, takes effect when uploaded 
       
add_file(){
	echo "Input the names of the files(and relative path) you want to add: [name/e (to exit)]" 
	while [ 1 ]; do
           read -p "Put one file name at a time: [e - to exit] " file_name 
           if [ $file_name != e ] 
              then 
              svn add $file_name
           else
              break
           fi
        done
        }

       #commits the repository and asks for a message to associate it with
       
commit_repo() {
 	echo "You are about to commit, please check the remote logs first!"
 	echo "Please enter your message for the commit:"
 	read -r commit_message
 	svn commit -m  "$commit_message"
 }

 # deletes files from active repo, changes take effect when commiting
 
delete_file() {
    echo "Input the names of the files(and relative path) you want to delete: [name/e (to exit)]" 
	while [ 1 ]; do
           read -p "Put one file name at a time: [e - to exit] " file_name 
           if [ $file_name != e ] 
              then 
              svn delete $file_name
           else
              break
           fi
        done
        }   

        # ignores folders not to be uploaded when commiting
        
ignore_folder(){
   echo "Input the names of the folders(and relative path) you want to ignore: [name/e (to exit)]"
   while [ 1 ]; do
           read -p "Put one folder name at a time: [e -to exit] " folder_name 
           if [ $folder_name != e ] 
              then 
              svn propset svn:ignore $folder_name
           else
              break
           fi
        done
        }

        # this prints the status of the svn repository
svn_status(){
  echo " 
===============================+STATUS+================================== 
? -> means the file is not added to the main svn repository on the server
A -> means the file is added to the local copy, and will be uploaded after you commit
D -> means the file is deleted from the local copy, changes will have effect after you commit
M -> means modified ( different from the copy in the main svn repository)
"
  svn status
  }
 
 
#main_function outputs the menu and a set of choices
#  goto menu function to look up the case scenarios
main_function(){
while [ 1 ]; do
    menu
    case $user_choice in
        1) checkout_repo  ;;
        2) update_repo    ;;
        3) local_logs     ;;
        4) remote_logs    ;;
        5) add_file       ;;
        6) commit_repo    ;;
        7) delete_file    ;;
        8) ignore_folder  ;;
        9) svn_status     ;;
        q) break          ;;
        *) echo "Not an Option";;
    esac
    sleep 1s
done             
}

counter=0

#checks the if the given username is in the set of allStudents
#           if the username is in the set, the loop immediately breaks and it outputs true
#           otherwise the counter will increase till it reaches the number of allStudents set and will produce false
username_check(){
  for i in ${allStudents[@]}; do
	       if [ $username = $i ];
		  then
		  echo true
		  break
	       elif [ $counter = $nr_students ];
		  then
		  echo false
		  break
	       else
		  counter=$((counter + 1))
	      fi
  done
}


#main function
#checks if username check returns true and executes main_function if yes

main() {
  if [ "$(username_check)" = "true" ]
     then
      echo "
      #                Welcome to SVN-client, $username                    #"
      main_function
  else 
      echo "$(tput setaf 1)ERROR 
Not a valid user $(tput setaf 7)"
  fi
}

#main function call

main

   else      #end of the opening if argument, that terminates the program if the argument is empty
      echo "$(tput setaf 1)Enter a username as an argument $(tput setaf 7)"
   fi
