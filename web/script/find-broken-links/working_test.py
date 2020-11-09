import sys, os
import json
from bs4 import BeautifulSoup

def extractPathsfromJSON(json):
    try:
        json.pop("-1")

        htmlPaths = []
        for gen in json:
            for page in json[gen]['pages']:
                htmlPaths.append(os.path.normpath("/"+page['href']))
        print("[+] All HTML files paths have been decoded from JSON")

        return htmlPaths

    except Exception as e:
        print("[-] Error in handling the JSON file. Is the format right?")
        print(e)
        exit()

# Returns the text inside a file
def openFile(path):
    path = os.path.normpath(os.path.realpath(__file__) + pathToWebfolder + path)
    f = open(path, "r")
    return f.read()

def checkBrokenLinks(path):
    if path not in checkedPaths:
        checkedPaths.append(path)

        text = openFile(path)
        #TODO: Checks for broken links recursively



checkedPaths = []
pathToWebfolder= "/../../../"
def main():


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
        for path in paths:
            checkBrokenLinks(path)

    else:
        print("[-] Input is not present")
        exit()


if __name__ == '__main__':
    main()