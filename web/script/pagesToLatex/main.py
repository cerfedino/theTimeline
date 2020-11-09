import os, sys
import io
import json

# Takes latex code in input, compiles it, outputs it to 'out.pdf' and opens it
def compileAndExportLatex(latexCode):
    with io.open("out.tex", "w", encoding='utf8') as f:
        f.write(latexCode)
        f.close()

    os.system("pdflatex out.tex")
    os.system("xdg-open out.pdf")

# Takes a page in the JSON format and outputs the latex code for it
def pageToLatex(json_page):
    pageLatex = ""
    try:
        product = json_page['product']
        date = json_page['date']
        author = json_page['author']

        description = json_page['description']
        href = json_page['href']
    except Exception as e:
        print("[-] Trouble extracting page informations from the JSON")
        print(e.error())
    print("[+] Extracted page '"+product+"'informations from JSON")

    pageLatex+=r'\pageHeader{'+product+r'}{'+date+r'}{'+author+r'}{'+description+r'}'

    # Function not ready yet
    # pageLatex += htmlToLatex( <body of html page> )

    pageLatex += r"\newpage"
    return pageLatex

# Takes HTML code in input and outputs the Latex Code
# TODO : Implement function
#def htmlToLatex(html):


def getJSONfromStdin():
    stdin = sys.stdin.read()
    if (stdin == ""):
        print("[-] Stdinput is not present")
        exit()
    else:
        print("[+] There is an input")
        try:
            json.loads(stdin)
        except:
            print("[-] Input can't be decoded as a valid JSON")
            exit()

        print("[+] Input is a valid JSON")

        jsonobj = json.loads(stdin)
        jsonobj.pop('-1')
        return jsonobj

def main():
    # Sets the cwd to the script's folder
    abspath = os.path.abspath(__file__)
    dname = os.path.dirname(abspath)
    os.chdir(dname)


    finalExport = '' # Contains the latex code that will be compiled into a pdf at the end
    # Puts the content of documentSetup.tex into finalExport
    with io.open("documentSetup.tex", "r", encoding='utf8') as f:
        finalExport += f.read()
        f.close()

    json_obj = getJSONfromStdin()

    #Iterates through every generation
    for gen in sorted(json_obj.keys()):
        #Creates a chapter for that generation
        finalExport+=r"\chapter{"+gen+r"}\newpage"

        # Iterates through every page of the generation
        for page in json_obj[gen]['pages']:
            finalExport+=pageToLatex(page)

        ##############
    #####################


    # Closes the document
    finalExport += r"\end{document}"

    # Writes the latex code to stdout
    sys.stdout.write(finalExport)

    compileAndExportLatex(finalExport)

if __name__ == '__main__':
    main()
