from bs4 import BeautifulSoup
import requests
import os, sys
import json
import operator
import datetime



# Returns an array containing the path to every html file in their *valid* directories
def listHTMLpages(path, ignoreDirs):
    dirs = os.listdir(path)
    htmlFiles = []
    for file in dirs:
        if os.path.isdir(os.path.join(path, file)) and file not in ignoreDirs:
            dirPath = os.path.join(path, file)
            files = os.listdir(dirPath)
            for file2 in files:
                if os.path.isfile(os.path.join(dirPath, file2)) and file2.lower().endswith('.html'):
                    htmlFilePath = os.path.join(dirPath, file2)
                    htmlFiles.append(htmlFilePath)
    return htmlFiles

# Return a dictionary object composed by the selected media tags of the page
# If a page doesn't have the required meta tags, returns False
def extractMeta(href,metaToExtract):
    r = open(href, "r")
    soup = BeautifulSoup(r, "html.parser")

    meta = soup.find_all('meta')

    currPage = {}
    currPage["href"] = href

    for tag in meta:
        if 'name' in tag.attrs.keys() and tag.attrs['name'] in metaToExtract:
            currPage[tag.attrs['name']] = tag.attrs['content']

    if all(key in currPage for key in metaToExtract):
        return currPage
    else:
        return False

# Inserts a dictionary page object inside an array of page objects, sorted by ascending date
def insertByDate(pages, insertPage):
    insDate = datetime.datetime.strptime(insertPage['date'], '%Y-%m-%d')
    for page in pages:
        pageDate = datetime.datetime.strptime(page['date'], '%Y-%m-%d')
        if pageDate >= insDate:
            pages.insert(pages.index(page), insertPage)
            return pages
    pages.append(insertPage)
    return pages

def main():
    # Meta tags' names to extract in every page
    metaToExtract = ["author", "date", "generation", "product", "description", "picture"]

    # Folder to scan for his subdirectories and html files
    folderToScan = '../../html/'

    # Folders to ignore
    foldersToIgnore = ["gen#_TEMPLATE", "timeline"]

    generations = {}
    generations['invalid'] = []

    pagesToIndex = listHTMLpages(folderToScan, foldersToIgnore)

    for href in pagesToIndex:

        currPage = extractMeta(href,metaToExtract)

        if currPage == False:
            generations['invalid'].append(href)
        else:
            currGen = currPage['generation']
            currPage.pop('generation')

            if currGen not in generations:
                generations[currGen] = {'pages': []}

            generations[currGen]['pages'] = insertByDate(generations[currGen]['pages'], currPage)


    generations['-1'] = {'gen#' : generations['gen#'], 'invalid':generations['invalid']}
    generations.pop('gen#')
    generations.pop('invalid')
    generations = dict(sorted(generations.items(), key=operator.itemgetter(0)))

    print(json.dumps(generations, indent=2))

    with open('out.json', 'w') as f:
        f.writelines(json.dumps(generations, indent=2))


if __name__ == '__main__':
    main()


