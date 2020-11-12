import os, sys
import io
import json
import string
from bs4 import BeautifulSoup
from selenium import webdriver

# Relative Web folder path
relWebfolder = '/../../'
# Absolute Web folder path
absWebfolder = os.path.normpath(os.path.dirname(os.path.abspath(__file__)) + relWebfolder) + "/"

# Relative html folder path
relHTMLpath = "html/"
# Absolute html folder path
absHTMLpath = os.path.normpath(absWebfolder + relHTMLpath)


# Takes latex code in input, compiles it, outputs it to 'out.pdf' and opens it
def compileAndExportLatex(latexCode):
    with io.open("out.tex", "w", encoding='utf8') as f:
        f.write(latexCode)
        f.close()

    os.system("pdflatex out.tex && (xdg-open out.pdf || open out.pdf)")

# Removes any characters that aren't included in ASCII (e.g japanese glyphs) and that are significant for latek
def sanitizeStringforLatex(text):
    remove = ['&','%','$','#','_','{','}','~','^','\\']
    for value in remove:
        text = text.replace(value, "")

    printable = set(string.printable)
    return ''.join(filter(lambda x: x in printable, text))

# Takes a page in the JSON format and outputs the latex code for it
def pageToLatex(json_page):
    # Contains the generated latex code for the page
    pageLatex = ""
    try:
        # Copies every value from the page attributes into their own variable
        product = sanitizeStringforLatex(json_page['product'])
        date = sanitizeStringforLatex(json_page['date'])
        author = sanitizeStringforLatex(json_page['author'])
        description = sanitizeStringforLatex(json_page['description'])
        href = json_page['href']

    except Exception as e:
        print("[-] Trouble extracting page informations from the JSON")
        print(e)
    print("[+] Extracted page '"+ product +"' informations from JSON")

    # Prints a page header
    pageLatex+=r'\pageHeader{'+product+r'}{'+date+r'}{'+author+r'}{'+description+r'}'

    try:
        # Creates a virtual ('headless') browser to open the html pages
        options = webdriver.ChromeOptions()
        options.add_argument('headless')
        browser = webdriver.Chrome(chrome_options=options)
    except Exception  as e:
        print("[-] Is ChromeDriver installed? (sudo apt install chromium-chromedriver)")
        print(e)

    absHref = absWebfolder + href
    # Opens the html page in the virtual browser
    browser.get("file://"+ absHref)
    soup = BeautifulSoup(browser.page_source, "html.parser")

    # Puts the content of the div with tag #content into the variable
    content = soup.select('div#content')

    # Generates the content of the page
    pageLatex += htmlToLatex(content, absHref)

    pageLatex += r"\newpage"
    return pageLatex

# Takes a list of HTML tags and RECURSIVELY looks into their content and generates the Latex code
def htmlToLatex(content, absHref):
    latex = ""

    soup = BeautifulSoup(str(content), 'html.parser')

    # Finds all top tags, without looking further into them
    tags = soup.find_all(recursive=False)

    # Goes through every tag
    for tag in tags:
        # Converts that tag into Latex code
        map = mapHTML(tag, absHref)
        # Gets the opening for the Latex code (e.g '\textbf{' )
        latex+= map['opening']
        # Iterates through every children tag contained within the tag
        for child in tag.children:
            # If it's just text
            if child.name is None:
                latex+= sanitizeStringforLatex(child) + " "
            # Otherwise it's another tag
            else:
                # Converts this tag also to Latex (Recursion)
                latex += htmlToLatex(child, absHref)
        latex += map['closing']

    return latex

# Parses the href attribute
def parseHref(href, absHref):
    # If the href starts with 'http' (aka is a web path)
    if href.startswith("http") == True:
        return href
    # If the href starts from the root (the web/ folder)
    elif href.startswith("/") == True:
        return absWebfolder + href
    # Otherwise it's a relative path from the page path (e.g 'media/pic1.gif' )
    else:
        return os.path.join(os.path.dirname(absHref), href)

# Returns the latex code surrounding the content of the HTML tag
def mapHTML(tag, absHref):
    opening = ""
    closing = ""
    name = tag.name
    if name == "b" or name == "strong":
        opening = r"\textbf{"
        closing = r"} "
    elif name == "h1":
        opening = r"\section{"
        closing = r"}"
    elif name == "h2":
        opening = r"\subsection{"
        closing = r"}"
    elif name == "h3":
        opening = r"\subsubsection{"
        closing = r"}"
    elif name == "i" or name == "em":
        opening = r"\textit{"
        closing = r"}"
    elif name == "u":
        opening = r"\underline{"
        closing = r"}"
    elif name == "a":
        # Only counts web paths, as local paths wouldnt work
        if tag['href'].startswith('http'):
            opening = r"\href{"+parseHref(tag['href'], absHref)+r"}{"
            closing += r"}"
    elif name == 'img':
        # To avoid errors, only display images that aren't GIFs. Latex doesnt like GIFs
        if not tag['src'].endswith('.gif'):
            if os.path.exists(parseHref(tag['src'], absHref)):
                opening = r'\includegraphics[height=4cm]{'+parseHref(tag['src'], absHref)+''
                closing = r'}'
            else:
                opening = r'\textbf{<missing image>'
                closing = r'}'
    elif name == "table":
        # For the table a special method has been written
        table=convHTMLtable(tag)
        opening = table['opening']
        closing = table['closing']
    elif name == "tr":
        closing = r"\\\hline"
    elif name == "td":
        opening += "& "
    elif name == "th":
        opening = r"& \textbf{"
        closing = r"} "

    return {"opening": opening, "closing" : closing}

# Converts an HTML table statement into latek code
def convHTMLtable(tag):
    opening = ""
    closing = ""
    # Integer representing the maximum number of cells in a single row
    maxTD = 0
    # Finds all the rows
    rows = tag.find_all('tr')
    # Iterates through every row
    for row in rows:
        # Gets all the cells in that row
        cells = row.find_all(recursive=False)
        maxTD = max(maxTD, len(cells))

    opening = r'\begin{longtable}{'

    opening += r'p{1mm}|'

    opening += r'l|'*maxTD
    opening += '}' \
              r'\hline'

    closing = r'\end{longtable}'

    return {"opening": opening, "closing" : closing}

# Imports the JSON data from stdline, allowing the input JSON to be piped into this script
def getJSONfromStdin():
    stdin = sys.stdin.read()
    if (stdin == ""):
        print("[-] Stdinput is not present")
        exit()
    else:
        print("[+] There is an input")
        try:
            jsonobj = json.loads(stdin)
        except Exception as e:
            print("[-] Input can't be decoded as a valid JSON")
            print(e)
            exit()

        print("[+] Input is a valid JSON")

        #Removes the invalid pages from the JSON
        jsonobj.pop('-1')
        return jsonobj



def main():
    # Sets the cwd to the script's folder
    dname = os.path.dirname(os.path.abspath(__file__))
    os.chdir(dname)

    # Contains the latex code that will be compiled into a pdf at the end
    finalExport = ''

    # Puts the content of documentSetup.tex into finalExport
    with io.open("documentSetup.tex", "r", encoding='utf8') as f:
        finalExport += f.read()
        f.close()

    # Imports the JSON object from the stdin input
    json_obj = getJSONfromStdin()

    # Iterates through every generation
    for gen in sorted(json_obj.keys()):
        #Creates a chapter for that generation
        finalExport+=r"\chapter{"+gen+r"}\newpage"

        # Iterates through every page of the generation
        for page in json_obj[gen]["pages"]:
            finalExport += pageToLatex(page)


    # Closes the document
    finalExport += r"\end{document}"

    # Writes the latex code to stdout
    sys.stdout.write(finalExport)

    compileAndExportLatex(finalExport)

if __name__ == '__main__':
    main()
