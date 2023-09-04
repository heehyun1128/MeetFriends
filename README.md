# MeetFriends


## Project Summary
This project is a clone of Meetup.com. Currently, the application allows users to Sign Up and Log In and to perform CRUD actions on Creating a Group, Viewing Group List and Group Details, Updating a Group Detail, and Deleting a Group. It also enables users to Create an Event, Review all Events and Event Details, and Delete an Event.

## Wiki Link

## Link to Live Site

https://meetup-backend-witc.onrender.com


## Contact the Project Owner
linkedin.com/in/yi-c-452811132
## Technologies Used

Frameworks, Platforms, and Libraries
> React

> Redux/Redux-thunk

> HTML 5

> CSS

> Javascript

> JSX

> Node.js / Express

> Sequelize ORM

Databae
> Development: SQLite

> Production: PostgreSQL

Hosting:
> Render.com





## Table of Contents
- Getting Started

- Project Demo
  - Project Features

      >Landing Page

      >Sign Up/ Log In/ Log Out

      >See All Groups

      >Find An Event

      >Start A New Group

      >View Group Details

      >Update Group Details

      >Delete a Group

      >Create an Event

      >View Event Details

      >Delete an Event

- Upcoming Features
- Frontend Redux Store Shape





## Getting Started

* Prerequesites

  Before you begin, please ensure that you have the following installed:

  - git
  
  - Node.js

  - npm package manager

* Start the project locally

  - Clone github repo to you local directory
    - git clone https://github.com/heehyun1128/API-project.git

  - install dependencies
    - npm install (npm i)
      ````bash
      npm install
  - Start the project
    - cd to backend directory and run npm start
      ````bash
      cd backend
      npm start
    - cd to frontend directory and run npm start
      ````bash
      cd frontend
      npm start
    - the project will be running locally at http://localhost:3000/
      

## Features

* Landing Page

Before a user is signed up/logged in, the user can only view all groups, all events, group details, event details, and their account details. The Start A New Group button on the home page is disabled for users not signed up or logged in.

After a user is signed up and logged in, the user can create groups and events for the groups, update the group, and delete groups and events they create.

![home-page]

[home-page]: ./images/meetup_home_page.png

* Sign Up/ Log In/ Log Out

Click on Sign Up button in the dropdown menu or the Join MeetFriends button on the home page to create a user. Click on Log In to log in a user. A Demo User is created for testing purposes. After a user is signed up or logged in, the Join MeetFriends button is removed from the home page. A user will be able to log out by clicking on the Log Out button in the User Drop Down Menu at the top right corner of the landing page.

![signup-page]

[signup-page]: ./images/meetup_signup_page.png

![login-page]

[login-page]: ./images/meetup_login_page.png

* See All Groups

The user can view all groups by clicking on the See All Groups link on the landing page or the View Groups link in the User Drop Down Menu at the top right corner of the landing page.


![home-group-btn]

[home-group-btn]: ./images/meetup_home_group_btn.png

Group List

![group-list]

[group-list]: ./images/meetup_group_list.png

* Find An Event

The user can view all events by clicking on the Find An Event link on the landing page or the View Events link in the User Drop Down Menu at the top right corner of the landing page.

![home-event-btn]

[home-event-btn]: ./images/meetup_home_event_btn.png

Event List

![event-list]

[event-list]: ./images/meetup_event_list.png

* Start A New Group

The navigation bar has a "Start a new group" link to the left of the user menu button when the current user is logged-in.
A user can also click on the "Start a new group" link on the landing page to navigate to the create group form page. The create group form provides instructions as to how to create a group.

![start-group-btn]

[start-group-btn]: ./images/meetup_start_group_btn.png

Create Group Form Page

![group-form-1]

[group-form-1]: ./images/meetup_group_form_1.png

![group-form-2]

[group-form-2]: ./images/meetup_group_form_2.png

* View Group Details

A user is able to view details of groups by clicking on any groups in the group list. The group detail page shows the Name, Location, type, organizer, and events of the group.

If a current user is logged-in but did NOT create the group, the user will be able to join the group by clicling on the "Join this group" button. A user NOT logged-in or signed up will not be able to join a group.

![group-detail-1.1]

[group-detail-1.1]: ./images/meetup_group_detail_1.1.png

If the user is logged-in and is the group's creator, the user will be able to create a group event by clicking on the Create Event button, update the group information by clicking on Update button, and delete the group by clicking on Delete button.

![group-detail-1]

[group-detail-1]: ./images/meetup_group_detail_1.png

The group detail page also shows Upcoming and past events. The user can clicking on the events to view event details.

![group-detail-2]

[group-detail-2]: ./images/meetup_group_detail_2.png

* Update Group Details

Clicking "Update" on the group's detail page navigates the user to the update group form. Values stored in the database will be pre-populated for that group. 

A user who is logged-in but does not own the group OR is not logged-in will not be albe to update the group.

![group-update-1]

[group-update-1]: ./images/meetup_group_update_1.png


![group-update-2]

[group-update-2]: ./images/meetup_group_update_2.png


* Delete a Group

Clicking the Delete button on a group's details page will open a confirmation modal popup window that ask the user to confirm removing or keeping the group.

![group-delete-2]

[group-delete-2]: ./images/meetup_group_delete.png


* Create an Event

A user who's logged in and is the group organizer will be able to create an event for the group. A user who's not logged in or is not the group organizer will be redirected to the home page when trying to access the create event form.

![event-form-1]

[event-form-1]: ./images/meetup_event_form_1.png

![event-form-2]

[event-form-2]: ./images/meetup_event_form_2.png

* View Event Details

A user can view event details by clicking on any event on the event list page.

![event-detail]

[event-detail]: ./images/meetup_event_detail.png


* Delete an Event

A user who is the geoup organizer can delete an event from the group.

![event-delete-2]

[event-delete-2]: ./images/meetup_event_delete.png

## Upcoming Features

* Enable Dark Mode/ Language Selection
* Update Event
* Venue
  - Create a Venue for a Group
  - Enable Selection of Venue for Group Events
  - View All Group Venues
  - Update Venue Information
  - Delete a Venue
* Membership
  - Join A Group (Sign Up for Group Membership)
  - View Current Group Members
  - Update Membership
  - Delete Group Membership
* Attendance
  - Join an Event (Sign Up for an Event)
  - View Current Attendee List
  - Update Attendance Status
  - Remove attendees


## Frontend Redux Store Shape
  ````base
  store = {
    session: {},
    groups: {
      allGroups: {
        [groupId]: {
          groupData,
        },
        optionalOrderedList: [],
      },
      singleGroup: {
        groupData,
        GroupImages: [imagesData],
        Organizer: {
          organizerData,
        },
        Venues: [venuesData],
      },
    },
    events: {
      allEvents: {
        [eventId]: {
          eventData,
          Group: {
            groupData,
          },
          Venue: {
            venueData,
          },
        },
      },
      // In this slice we have much more info about the event than in the allEvents slice.
      singleEvent: {
        eventData,
        Group: {
          groupData,
        },
        // Note that venue here will have more information than venue did in the all events slice. (Refer to your API Docs for more info)
        Venue: {
          venueData,
        },
        EventImages: [imagesData],
        // These would be extra features, not required for your first 2 CRUD features
        Members: [membersData],
        Attendees: [attendeeData],
      },
    },
  };
