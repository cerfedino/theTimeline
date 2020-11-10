from bs4 import BeautifulSoup
import os, sys
import json
import datetime

# Folder to scan for his subdirectories and html files
relWebfolder = '/../../'
absWebfolder = os.path.normpath(os.path.dirname(os.path.abspath(__file__)) + relWebfolder)

relHTMLpath = "/html/"
absHTMLpath = os.path.normpath(absWebfolder + relHTMLpath)

# Returns an array containing the path to every html file in their *valid* directories
def listHTMLpages(ignoreDirs):
    dirs = os.listdir(absHTMLpath)
    htmlFiles = []
    for file in dirs:
        if os.path.isdir(os.path.join(absHTMLpath, file)) and file not in ignoreDirs:
            absDirPath = os.path.join(os.path.normpath(absWebfolder+relHTMLpath), file)
            files = os.listdir(absDirPath)
            for file2 in files:
                if os.path.isfile(os.path.join(absDirPath, file2)) and file2.lower().endswith('.html'):
                    htmlFilePath = os.path.join(relHTMLpath, file, file2)
                    htmlFiles.append(htmlFilePath)
    return htmlFiles

# Return a dictionary object composed by the selected media tags of the page
# If a page doesn't have the required meta tags, returns False
def extractMeta(relHref, metaToExtract):
    absHref = absWebfolder+relHref
    r = open(absHref, "r")
    soup = BeautifulSoup(r, "html.parser")

    meta = soup.find_all('meta')

    currPage = {}
    currPage["href"] = relHref

    for tag in meta:
        if 'name' in tag.attrs.keys() and tag.attrs['name'] in metaToExtract:
            currPage[tag.attrs['name']] = tag.attrs['content']

    if isPageValid(currPage,metaToExtract):
        return currPage
    else:
        return False

# Check if the page is valid
def isPageValid(page, metaToExtract):
    valid = True
    try:
        datetime.datetime.strptime(page['date'], '%Y-%m-%d')
    except Exception as e:
        valid = False


    if all(key in page for key in metaToExtract) and valid:
        return True
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

    # Folders to ignore
    foldersToIgnore = ["gen#_TEMPLATE", "timeline"]

    generations = {}
    generations['invalid'] = []

    pagesToIndex = listHTMLpages(foldersToIgnore)

    for relHref in pagesToIndex:

        currPage = extractMeta(relHref,metaToExtract)

        if currPage == False:
            generations['invalid'].append(relHref)
        else:
            currGen = currPage['generation']
            currPage.pop('generation')

            if currGen not in generations:
                generations[currGen] = {'pages': []}

            generations[currGen]['pages'] = insertByDate(generations[currGen]['pages'], currPage)


    generations['-1'] = {'gen#' : generations['gen#'], 'invalid':generations['invalid']}
    generations.pop('gen#')
    generations.pop('invalid')
    generations = json.dumps(generations, sort_keys=True, indent=2)

    #print(json.dumps(generations, indent=2))

    sys.stdout.write(generations)

if __name__ == '__main__':
    main()


