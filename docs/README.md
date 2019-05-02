# Quick Start


Install the `fluro-vue` package via npm

```bash
npm install fluro-vue --save

```

Include in your Vue app, and initialize with your `vuex` store
```javascript
// main.js

import Vue from 'vue'
import store from './store'

/////////////////////////////////////////////////////

import Fluro from 'fluro-vue';
Vue.use(Fluro, { store });

````


## Basic Usage
The `fluro` javascript API is registered on the root Vue instance, and is injected into all child components of the root and will be available on them as `this.$fluro`.

```javascript

//Example component
export default {
    data() {
        return {}
    },
    mounted(){

        //Request the current user session from the Fluro API
        this.$fluro.api.get('/session')
        .then(function(res) {
            //res.data will be the user session
        })
        .catch(function(err) {
            //Probably not logged in
        })

    }
}
```

# Fluro Services
`fluro-vue` includes the `fluro` and all of it's services
They are accessible from your components from the global `this.$fluro` namespace or by importing directly into your code.

| Props | Description |
| ----------- | ----------- |
| `this.$fluro.api` | A helper service for making http requests to the [Fluro REST API](https://developers.fluro.io/) it's a wrapper around the [axios](https://www.npmjs.com/package/axios) library that works in conjunction with the other Fluro modules|
| `this.$fluro.auth` | The default service for managing authentication handles automatic refreshing of access tokens, and provides login, logout and other user/application specific functionality |
| `this.$fluro.content` | A helper service for Create, Read, Update and Delete operations that wraps around the fluro.api service |
| `this.$fluro.asset` | The default service for managing, rendering and handling files and media from Fluro. It contains helper functions for managing connecting to image, audio, asset and video api endpoints. |
| `this.$fluro.date` | Provides date functions, filters and utilities for working with dates and timezones |
| `this.$fluro.access` | A helper service for understanding a user's access permissions |
| `this.$fluro.stats` | The default service for handling a user's 'stats' eg. (likes, views, favorites, downvotes etc...) This service creates and syncs user's stats when they 'stat' items from Fluro. |
| `this.$fluro.types` | A helper service for retrieving, translating and rendering content types and definitions defined within Fluro. |
| `this.$fluro.utils` | Provides helper functions for working with Fluro data |
| `this.$fluro.cache` | Provides a cache service, used for creating, clearing and storing API requests and other information in memory, rarely used directly |

For more information and up to date functionality checkout the [Fluro Javascript API Documentation](https://fluro-developers.github.io/fluro/)

## Examples

```javascript

//Retrieves the latest 6 'articles' with a status of 'active' from Fluro
//Including the title, first line, keywords, created date and slug
this.$fluro.api.get('/content/article', {
        params: {
            sort: '-created',
            status:'active',
            fields: [
                'title',
                'firstLine',
                'keywords',
                'created',
                'slug',
            ],
            limit: 6,
        }
}).then(function(res) {
    //res.data will be an array of results
});

```

```javascript

//Retrieves the results of a Fluro query 
this.$fluro.content.query('59f6b903f9b8231cb9394ccc')
.then(function(response) {
    //response is an array of results
});

```


```javascript

//Runs a dynamic query and returns the results
var criteria = {
    "_type": "event",
    "startDate": {
        "$gte": "date('-1 years')",
        "$lt": "date('now')"
    },
    "status": {
        "$in": ["active", "archived"]
    }
}

/////////////////////////////////////////////

this.$fluro.content.retrieve(criteria, {
    select: 'title firstLine startDate endDate firstLine realms definition',
    sort: '-startDate'
})
.then(function(response) {
    //response is an array of the resulting items
}, reject);

```

```javascript

    var item = {
        "_id":"59f6b903f9b8231cb9394ccc",
        "_type":"asset",
        "filename":"MyAsset.pdf",
        ...
    }

    //Returns 'https://api.fluro.io/download/59f6b903f9b8231cb9394ccc/file/MyAsset.pdf?access_token=...'
    this.$fluro.asset.downloadUrl(item);

    //Returns 'https://api.fluro.io/get/59f6b903f9b8231cb9394ccc?access_token=...'
    this.$fluro.asset.getUrl(item._id);
```

# Filters
`fluro-vue` registers a few helpful filters on the global scope

| Filter | Input  | Description |
| ----------- | -----------  | ----------- |
| `formatDate` | String/Date  | Returns a human-readable date using a specified format|
| `readableEventDate` | Event  | Returns a human-readable date for an event taking into consideration the context of the current time, the event's start and end time.|
| `filesize` | Integer  | Returns bytes eg '235463246' into a human readable format eg. '1.4mb' |
| `comma` | Array | Returns a comma seperated list of an array of objects |

## Examples


```html

<!-- Returns '11:30am Thursday 5th Jun 2016' -->
{{ event.startDate | formatDate('h:mma dddd Do MMM YYYY ')}}

<!-- Returns '5 - 8 March 2019' -->
{{ myEvent | readableEventDate}}

<!-- Returns '15.7mb' -->
{{ file.size | filesize}}

<!-- Returns 'Jeff Goldbum, Kevin Durant, Max Power' -->
{{[{title:"Jeff Goldblum"}, {title:"Kevin Durant"}, {title:"Max Power"} ] | comma('title')}}


```

# UI Components

## Avatar
A component that makes it quick and easy to show an avatar for a Fluro user, persona or contact 


```html
<!-- Show an extra large avatar for a Fluro global user -->
<fluro-avatar class="xl" :id="user._id" type="user"></fluro-avatar>

<!-- Show an extra small avatar for a Fluro contact -->
<fluro-avatar class="xs" :id="contact._id" type="contact"></fluro-avatar>

<!-- Show the avatar for a Fluro persona -->
<fluro-avatar class="xl" :id="user.persona" type="persona"></fluro-avatar>

```


## Image
A component that makes it easy to render an image from Fluro


| Props | Description |
| ----------- | ----------- |
| `item` | An object representing a Fluro image, *can also just be a string _id of the image* |
| `width` | Set an explict width for the image *if not provided then width will be inferred from the user's screen size* |
| `height` | Set an explict height for the image *if not provided then height will be inferred from the user's screen size* |
| `spinner` | Whether a preloader spinner should show while the image is loading |


| Attributes | Description |
| ----------- | ----------- |
| `cover` | The image will cover the entire area |
| `contain` | The entire image will be contained within the box |


| Events | Description |
| ----------- | ----------- |
| `load` | Fires when the image has finished loading |
| `error` | If there was an error loading the image |

> Example Usage

```html
<!-- Renders an image with a preloading spinner -->
<fluro-image contain :item="image" :spinner="true" @load="onLoad" @error="onError"/>


```




## Video
A component that makes it easy to render a video from Fluro. Depending on
whether the video is an uploaded file, embed code or provided from an external service
like youtube or vimeo. If possible it will also render the poster image before playback


| Props | Description |
| ----------- | ----------- |
| `item` | An object representing the Fluro video, usually loaded from the API|
| `options` | Extra parameters that can be passed into the player |

> Example Usage

```html
<!-- Renders a video depending on the media provider -->
<fluro-video :item="video" :options="{}"></fluro-video>


```


## Video Thumbnail
A component that makes it easy to render a thumbnail image of a video from Fluro

| Props | Description |
| ----------- | ----------- |
| `item` | An object representing the Fluro video, or the video ID|

> Example Usage

```html
<!-- Renders an image with a preloading spinner -->
<fluro-video-thumbnail :item="video"></fluro-video-thumbnail>
```

## Fluro WYSIWYG Editor
A component that makes it quick and easy to show render a rich text editor, complete with code beautifying, the ability to
mention other users by typing in @their.name and fits in and inherits the styles of the rest of your app

| Props | Description |
| ----------- | ----------- |
| `v-model` | Bind the html string to edit|
| `placeholder` | Add a placeholder|

> Example Usage

```html
<fluro-editor v-model="html" placeholder="Type your text in here"></fluro-editor>
```

```javascript
import FluroEditor from 'fluro-vue';

////////////////////////////////////////////////////////

export default {
    components: {
        FluroEditor,
    },
    data() {
        return {
            html:'',
        }
    }
}
```

## Fluro Code Editor
An inline code editor, capable of inputting, rendering, beautifying your JSON, Javascript, HTML or SCSS/CSS code input

| Props | Description |
| ----------- | ----------- |
| `v-model` | Bind the string to edit|
| `lang` | Select the language/syntax format, Can be `json` `html` `js` or `css`|
| `height` | The starting height for the editor|

> Example Usage

```javascript
import FluroCodeEditor from 'fluro-vue';

////////////////////////////////////////////////////////

export default {
    components: {
        FluroCodeEditor,
    },
    data() {
        return {
            script:'',
        }
    }
}
```


```html
<fluro-code-editor v-model="script" lang="json" :height="200"></fluro-code-editor>
```




## Fluro Content Form
Renders a selection of form fields from your types, queries, components or definitions in Fluro. 
It will automatically render all of the fields, using the Fluro Content Field component.

| Props | Type | Description |
| ----------- | ----------- | ----------- |
| `v-model` | Object | The model to edit |
| `fields` | Array | The array of fields to render, (Usually the array from a definition) |

> Example Usage

```javascript
import FluroContentForm from 'fluro-vue';

////////////////////////////////////////////////////////

export default {
    components: {
        FluroContentForm,
    },
    data() {
        return {
            model:{},
        }
    }
}
```

```html
<fluro-content-form v-model="model" :fields="definition.fields"></fluro-content-form>
```






## Fluro Content Field
Renders a form field as defined within Fluro
It will render all nested children and embedded fields recursively. This is mainly used 
within the Fluro Content Form Component

| Props | Type | Description |
| ----------- | ----------- | ----------- |
| `v-model` | Object | The model to edit |
| `field` | Object | The field description object from fluro |

> Example Usage

```javascript
import FluroContentField from 'fluro-vue';

////////////////////////////////////////////////////////

export default {
    components: {
        FluroContentField,
    },
    data() {
        return {
            model:{},
            field:{
                minimum:1,
                maximum:3,
                type:'string',
                directive:'select',
                defaultValues:[]
                allowedValues:[],
                options:[{
                    name:'Option 1',
                    value:'one',
                }]
            }
        }
    }
}
```

```html
<fluro-content-field :field="field" v-model="model"></fluro-content-field>
```





## Fluro Signature Field
Renders a signature input that allows a user to add their signature for a form

| Props | Type | Description |
| ----------- | ----------- | ----------- |
| `v-model` | Object | The model to edit |
| `label` | String | The label to show above the signature |
| `required` | Boolean | Whether or not this field should show an error if no input is added |
| `errorMessages` | Array | An array of error messages to display to the user |
| `hint` | String | Hint or descriptive text to show below the field |

> Example Usage

```javascript
import FluroContentField from 'fluro-vue';

////////////////////////////////////////////////////////

export default {
    components: {
        FluroContentField,
    },
    data() {
        return {
            model:{},
            field:{
                minimum:1,
                maximum:3,
                type:'string',
                directive:'select',
                defaultValues:[]
                allowedValues:[],
                options:[{
                    name:'Option 1',
                    value:'one',
                }]
            }
        }
    }
}
```

```html
<fluro-signature-field :label="label" v-model="fieldModel" :required="required" :error-messages="errorMessages" :hint="field.description"/>
```




## Fluro Date+Time Picker
Renders an input that allows a user to quickly select a time and date.
Allows for data entry of a full Javascript date timestamp as a string or date

| Props | Type | Description |
| ----------- | ----------- | ----------- |
| `v-model` | Object | The date to edit |
| `label` | String | The label to show above the signature |
| `format` | String | The format to display for the date when rendered in the text input |

> Example Usage

```javascript
import FluroDateTimePicker from 'fluro-vue';

////////////////////////////////////////////////////////

export default {
    components: {
        FluroDateTimePicker,
    },
    data() {
        return {
            date:'2016-04-03T07:10:11.004Z',
        }
    }
}
```

```html
<fluro-date-time-picker format="h:mma - dddd D MMMM YYYY" timePickerFormat="ampm" :label="label" v-model="date" />
```



