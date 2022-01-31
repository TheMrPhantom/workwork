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
* firstname String
* lastname String
* mail String
* password LargeBinary
* rolle Integer
* is_deleted Boolean
* salt String
* extraHours Integer
* last_modified DateTime

### worktime
* member_id Integer
* sport_id Integer
* description Text
* date DateTime
* minutes Integer
* pending Boolean
* is_deleted Boolean

### sportMember
* member_id Integer
* sport_id Integer
* is_trainer Boolean

### sport
* name String
* extra_hours Integer
* is_deleted Boolean

### Settings
* key String
* value String
* last_modified DateTime

### event
* name String
* sport_id Integer
* trainer_id Integer
* date DateTime
* is_deleted Boolean

### timeslot
* event_id Integer
* name String
* helper Integer
* start DateTime
* end DateTime

### eventParticipant
* member_id Integer
* timeslot_id Integer

### Wordlist from 
https://github.com/davidak/wortliste
