import sys, os
import json
from bs4 import BeautifulSoup
import requests

# Relative Web folder path
relWebfolder = '/../../'
# Absolute Web folder path
absWebfolder = os.path.normpath(os.path.dirname(os.path.abspath(__file__)) + relWebfolder) + "/"

# Relative html folder path
relHTMLpath = "html/"
# Absolute html folder path
absHTMLpath = os.path.normpath(absWebfolder + relHTMLpath)

# Extracts the HTML pages' paths from JSON
def extractPathsfromJSON(json):
    try:
        json.pop("-1")

        htmlPaths = []
        for gen in json:
            for page in json[gen]['pages']:
                htmlPaths.append(os.path.normpath(absWebfolder+"/"+page['href']))
        print("[+] All HTML files paths have been decoded from JSON")

        return htmlPaths

    except Exception as e:
        print("[-] Error in handling the JSON file. Is the format right?")
        print(e)
        exit()

# Returns the text inside a file
def openFile(path):
    f = open(path, "r")
    return f.read()

# Extracts all the Web URLs from an HTML page and check if they are broken
def checkBrokenLinks(path):
    print(path)
    text = openFile(path)

    soup = BeautifulSoup(text, 'html.parser')
    # Extracts every 'a' tag
    tags = soup.find_all('a')
    # Iterates through every tag
    for tag in tags:
        # If its a web path
        if tag['href'].startswith('http'):
            if checkLink(tag['href']) == True:
                print('    [OK]     '+tag['href'])
            else:
                print('    [BROKEN] ' + tag['href'])




# Returns True if the link is working, False if it broken
def checkLink(link):
    try:
        requestObj = requests.get(link);
        if (requestObj.status_code in [400,404,403,408,409,501,502,503, 526]):
            return False
        else:
            return True
    except Exception as e:
        return False

def main():

    # Reads the JSON from STDIN
    stdin = sys.stdin.read()

    if (stdin != ""):
        print("[+] There is an input")
        try:
            json.loads(stdin)
        except:
            print("[-] Input can't be decoded as a valid JSON")
            exit()

        print("[+] Input is a valid JSON")

        paths = extractPathsfromJSON(json.loads(stdin))
        # Iterates through every HTML page's path
        for path in paths:
            checkBrokenLinks(path)

    else:
        print("[-] Input is not present")
        exit()


if __name__ == '__main__':
    main()