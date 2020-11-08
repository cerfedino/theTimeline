import sys

# Used for sending HTTP requests
import requests

# Splitting contents of URL
from urllib.parse import urlparse
# Combining contents of URL
from urllib.parse import urljoin

# BeautifulSoup used for web scraping
from bs4 import BeautifulSoup

# List for all searched links
links_searched = []
# List for all broken links
links_broken = []

def getLinksHTML(html):
    def getLink(element):
        return element["href"]
        # Applies function map(getLink) to all link a[href] elements scraped/selected with BeatifulSoup
    # Returns a list of all links found
    return list(map(getLink, BeautifulSoup(html, features="html.parser").select("a[href]")))

# Finds all broken links and takes as arguments the domain, URL and parent URL
def find_links_broken(searchDomain, URL, pURL):
    # Excludes the links containing mail references, javascript files and pictures
    if (not (URL in links_searched)) and (not URL.startswith("mailto:")) and (not ("javascript:" in URL)) and (not URL.endswith(".jpg")) and (not URL.endswith(".jpeg")) and (not URL.endswith(".png") and (not URL.endswith(".gif")):
        # Tries to make a HTTP request to the provided URL
        try:
            # Object that take an URL request
            reqObject = requests.get(URL);
            # Add the URL to the list for searched links
            links_searched.append(URL)
            # If the status code of the page raises 404 ERROR, adds the link to the broken links list
            if(reqObject.status_code == 404):
                links_broken.append("Broken - Link: " + URL + " From: " + pURL)
                # Prints the status of the link on terminal
                print(links_broken[-1])
            # If the request does not raise any error
            else:
                # Prints the status of the link on terminal
                print("Not Broken - Link: " + URL + " From: " + pURL)
                # If the network location part is the same as the domain that needs to be searched
                if urlparse(URL).netloc == searchDomain:
                    # For every link in the request
                    for link in getLinksHTML(reqObject.text):
                        # Apply the function find_links_broken
                        find_links_broken(searchDomain, urljoin(URL, link), URL)
        # If the try fails and there is an Exception error, print the following:
        except Exception as error:
            # Prints error with error description
            print("Error: " + str(error));
            # Adds the link to the searched link list
            links_searched.append(searchDomain)

# Call function with network location part command-line argument, command-line URL, pURL (initially empty)
# Raises IndexError if no values are supplied for the first and second argument
find_links_broken(urlparse(sys.argv[1]).netloc, sys.argv[1], "")

print("\n*** All links have been checked! ***\n")
print("Links that were broken:")

# If there are no broken links
if(links_broken == []):
    print("None")
# Else print all broken links
else:
    for link in links_broken:
        print ("\t" + link)
