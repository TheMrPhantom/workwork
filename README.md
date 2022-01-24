# workwork
[![CodeQL](https://github.com/TheMrPhantom/workwork/actions/workflows/codeql-analysis.yml/badge.svg?branch=master)](https://github.com/TheMrPhantom/workwork/actions/workflows/codeql-analysis.yml)
[![njsscan sarif](https://github.com/TheMrPhantom/workwork/actions/workflows/njsscan-analysis.yml/badge.svg?branch=master)](https://github.com/TheMrPhantom/workwork/actions/workflows/njsscan-analysis.yml)

## Color Scheme
* #bbc34f
* #5a5c3d
* #797b5a
* #343433
* #c8c8c8

## SQL Scheme
### member
* firstname TEXT
* lastname TEXT
* mail TEXT
* password TEXT
* rolle TEXT
* deleted INTEGER
* salt TEXT
* extraHours INTEGER

### worktime
* memberID INTEGER
* sportID INTEGER
* description TEXT
* minutes INTEGER
* pending INTEGER
* deleted INTEGER

### sportMember
* memberID INTEGER
* sportID INTEGER
* isTrainer INTEGER

### sport
* name TEXT
* extraHours INTEGER
* deleted INTEGER

### Settings
* key TEXT
* value TEXT
* last_modified DATE

### event
* name TEXT
* sportID INTEGER
* date TEXT
* deleted INTEGER

### timeslot
* eventID INTEGER
* name TEXT
* helper INTEGER
* start TEXT
* end TEXT

### eventParticipant
* memberID INTEGER
* timeslotID INTEGER

### Wordlist from 
https://github.com/davidak/wortliste
