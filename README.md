# Nodejs Online Store App

This repository is part of nodejs course for backend.

The application is built with `Typescript` `Express Js` `Nodemon` `MongoDB` and `Mongez`.

## Installation

Just clone the repository then:

`yarn install`

Or

`npm i`

## Starting the application

Open the application root directory then run:

`yarn start`

Or

`npm run start`

## Contribution

Feel free to make any **PR** or if you've any suggestions or issues open a new one :)

## TODO

### General Updates

- Replace `Luxon` with `dates-fns`.

### Resources

- Create a dates resource type to cover:
  - Formatted date
  - Unix Timestamp
  - Human Time
  - Textual Time

### Database

- Create `Join` Aggregate.
- Create `Unwind` Aggregate.
- Create `Group By` Aggregate.
- Create `whereLike` method.
- Add `textSearch` index.
- Add `geoLocation` where clause.
- Add `geoLocation` index.
- Add `populate` method with `Aggregate` framework.
- Create `onModelUpdate` `onModuleUpdatePull` `onModelDelete` `onModelDeleteUnset` `onModelDeletePull` helpers in the model so when model is updated, update other models.

### Validation

- Allow validating values in arrays, i.e `name.*.text`.
- Add custom errors in the error bag.

### Unit Tests

- Create unit test structure

### Request

- Create request rate limit for DDOS Attacks.
- Create a full standard JWT tokens.
- Handle Cookies.

### Web Sockets

- Create Web Sockets structure

### Cache Drivers

- Create Redis Cache Driver.

### Logger

- Create `file` log driver.
- Create `Database` log driver.
- Create `Redis` log driver.
- Create `Slack` log Driver.
- Create `Custom API` log Driver

### Console

- Create Console Structure.

### Mailer

- Create `mailer` module.

### Notifications

- Create `web notifications`.
- Create `firebase notifications`
- Create `notification center`
