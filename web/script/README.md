How to use the scripts

# How to use the scripts
### Install requirements
Every script has its own requirements.txt file.
Install each scripts dependencies by doing
```bash
pip3 install -r requirements.txt
```
## Page Mapper script
This script compiles a JSON list that contains every page sorted by generation.
Under element '-1' are present the invalid pages (aka pages that
didnt respect tha naming conventions/don't include some tags ecc)

```bash
python3 web/scripts/pageMapper_python/main.py
```
The scripts outputs the JSON in stdout

## Find broken links script
```bash
python3 web/scripts/pageMapper_python/main.py | python3 find-broken-links/main.py
```

## Pages-to-latex script
```bash
python3 web/scripts/pageMapper_python/main.py | python3 pagesToLatex/main.py
```