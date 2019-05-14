<template>
    <div class="fluro-editor">
        <!-- <pre>{{model}}</pre> -->
        <!-- <editor-floating-menu :editor="editor">
            <div slot-scope="{ commands, isActive, menu }" class="editor__floating-menu" :class="{ 'is-active': menu.isActive }" :style="`top: ${menu.top}px`">
                <v-menu :fixed="true" transition="slide-y-transition" offset-y>
                    <template v-slot:activator="{ on }">
                        <v-btn small icon :disabled="showSource" v-on="on">
                            H1
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-tile :class="{ 'active': isActive.heading({ level: 1 }) }" @click="commands.heading({ level: 1 })">
                            <v-list-tile-content><span class="h1">Heading 1</span></v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile :class="{ 'active': isActive.heading({ level: 2 }) }" @click="commands.heading({ level: 2 })">
                            <v-list-tile-content><span class="h2">Heading 2</span></v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile :class="{ 'active': isActive.heading({ level: 3 }) }" @click="commands.heading({ level: 3 })">
                            <v-list-tile-content><span class="h3">Heading 3</span></v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile :class="{ 'active': isActive.heading({ level: 4 }) }" @click="commands.heading({ level: 4 })">
                            <v-list-tile-content><span class="h4">Heading 4</span></v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile :class="{ 'active': isActive.heading({ level: 5 }) }" @click="commands.heading({ level: 5 })">
                            <v-list-tile-content><span class="h5">Heading 5</span></v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <button class="menubar__button" :class="{ 'is-active': isActive.bullet_list() }" @click="commands.bullet_list">
                    <icon name="ul" />
                </button>
                <button class="menubar__button" :class="{ 'is-active': isActive.ordered_list() }" @click="commands.ordered_list">
                    <icon name="ol" />
                </button>
                <button class="menubar__button" :class="{ 'is-active': isActive.blockquote() }" @click="commands.blockquote">
                    <icon name="quote" />
                </button>
                <button class="menubar__button" :class="{ 'is-active': isActive.code_block() }" @click="commands.code_block">
                    <icon name="code" />
                </button>
            </div>
        </editor-floating-menu> -->
        <editor-menu-bar :editor="editor">
            <div class="fluro-editor-toolbar" slot-scope="{ commands, isActive }">
                <v-btn icon small flat class="hidden-xs-only" :class="{ 'is-active':showSource }" @click="showSource = !showSource">
                    <v-icon>{{showSource ? 'edit':'code'}}</v-icon>
                </v-btn>
                <v-btn icon :disabled="showSource" small flat :class="{ 'active': isActive.bold() }" @click="commands.bold">
                    <v-icon>format_bold</v-icon>
                </v-btn>
                <v-btn icon :disabled="showSource" small flat :class="{ 'active': isActive.italic() }" @click="commands.italic">
                    <v-icon>format_italic</v-icon>
                </v-btn>
                <v-btn icon :disabled="showSource" small flat :class="{ 'active': isActive.underline() }" @click="commands.underline">
                    <v-icon>format_underline</v-icon>
                </v-btn>
                <!-- <v-btn icon :disabled="showSource" small flat :class="{ 'active': isActive.strike() }" @click="commands.strike">
                    <v-icon>format_strikethrough</v-icon>
                </v-btn> -->
                <v-menu :fixed="true" transition="slide-y-transition" offset-y>
                    <template v-slot:activator="{ on }">
                        <v-btn small icon :disabled="showSource" v-on="on">
                            H1
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-tile :class="{ 'active': isActive.heading({ level: 1 }) }" @click="commands.heading({ level: 1 })">
                            <v-list-tile-content><span style="margin:0 !important" class="h1">Heading 1</span></v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile :class="{ 'active': isActive.heading({ level: 2 }) }" @click="commands.heading({ level: 2 })">
                            <v-list-tile-content><span style="margin:0 !important" class="h2">Heading 2</span></v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile :class="{ 'active': isActive.heading({ level: 3 }) }" @click="commands.heading({ level: 3 })">
                            <v-list-tile-content><span style="margin:0 !important" class="h3">Heading 3</span></v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile :class="{ 'active': isActive.heading({ level: 4 }) }" @click="commands.heading({ level: 4 })">
                            <v-list-tile-content><span style="margin:0 !important" class="h4">Heading 4</span></v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile :class="{ 'active': isActive.heading({ level: 5 }) }" @click="commands.heading({ level: 5 })">
                            <v-list-tile-content><span style="margin:0 !important" class="h5">Heading 5</span></v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <v-menu :fixed="true" transition="slide-y-transition" offset-y>
                    <template v-slot:activator="{ on }">
                        <v-btn small icon :disabled="showSource" v-on="on">
                            <v-icon>image</v-icon>
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-tile @click="showImagePrompt(commands.image)">
                            <v-list-tile-content>Add Image</v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <!-- 
                <v-btn icon :disabled="showSource" small flat :class="{ 'active': isActive.heading({ level: 1 }) }" @click="commands.heading({ level: 1 })">
                    H1
                </v-btn>
                <v-btn icon :disabled="showSource" small flat :class="{ 'active': isActive.heading({ level: 2 }) }" @click="commands.heading({ level: 2 })">
                    H2
                </v-btn>
                <v-btn icon :disabled="showSource" small flat :class="{ 'active': isActive.heading({ level: 3 }) }" @click="commands.heading({ level: 3 })">
                    H3
                </v-btn>
                <v-btn icon :disabled="showSource" small flat :class="{ 'active': isActive.heading({ level: 4 }) }" @click="commands.heading({ level: 4 })">
                    H4
                </v-btn>
                <v-btn icon :disabled="showSource" small flat :class="{ 'active': isActive.heading({ level: 5 }) }" @click="commands.heading({ level: 5 })">
                    H5
                </v-btn> -->
                <!-- <v-btn icon :disabled="showSource" small flat :class="{ 'active': isActive.code_block() }" @click="commands.code_block">
                        <v-icon>code</v-icon>
                    </v-btn> -->
                <!--  -->
                <!-- <v-btn class="menubar__button" :class="{ 'active': isActive.alignment({ textAlign: 'left' }) }" @click="commands.alignment({ textAlign: 'left' })">
                    <v-icon>format_align_left</v-icon>
                </v-btn>
                <v-btn class="menubar__button" :class="{ 'active': isActive.alignment({ textAlign: 'center' }) }" @click="commands.alignment({ textAlign: 'center' })">
                    <v-icon>format_align_center</v-icon>
                </v-btn>
                <v-btn class="menubar__button" :class="{ 'active': isActive.alignment({ textAlign: 'center' }) }" @click="commands.alignment({ textAlign: 'right' })">
                    <v-icon>format_align_right</v-icon>
                </v-btn> -->
                <!--  -->
                <v-btn icon :disabled="showSource" small flat :class="{ 'active': isActive.bullet_list() }" @click="commands.bullet_list">
                    <v-icon>format_list_bulleted</v-icon>
                </v-btn>
                <v-btn icon :disabled="showSource" small flat :class="{ 'active': isActive.ordered_list() }" @click="commands.ordered_list">
                    <v-icon>format_list_numbered</v-icon>
                </v-btn>
                <v-btn icon :disabled="showSource" small flat :class="{ 'active': isActive.blockquote() }" @click="commands.blockquote">
                    <v-icon>format_quote</v-icon>
                </v-btn>
                <v-btn icon :disabled="showSource" small flat :class="{ 'active': isActive.horizontal_rule() }" @click="commands.horizontal_rule">
                    <v-icon>minimize</v-icon>
                </v-btn>
                <!--  -->
                <!--  <v-btn icon class="hidden-xs-only" :disabled="showSource" small flat @click="commands.undo">
                    <v-icon>undo</v-icon>
                </v-btn>
                <v-btn icon class="hidden-xs-only" :disabled="showSource" small flat @click="commands.redo">
                    <v-icon>redo</v-icon>
                </v-btn> -->
                <v-menu :fixed="true" transition="slide-y-transition" offset-y>
                    <template v-slot:activator="{ on }">
                        <v-btn small class="hidden-xs-only" icon :disabled="showSource" v-on="on">
                            <v-icon>grid_on</v-icon>
                        </v-btn>
                    </template>
                    <v-list dense>
                        <v-list-tile @click="commands.createTable({rowsCount: 3, colsCount: 3, withHeaderRow: false })">
                            <v-list-tile-title>Insert Table</v-list-tile-title>
                        </v-list-tile>
                        <span v-if="isActive.table()">
                            <!-- <v-subheader>Row</v-subheader> -->
                            <v-list-tile @click="commands.addRowBefore">
                                <v-list-tile-content>
                                    Insert Row Before
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile @click="commands.addRowAfter">
                                <v-list-tile-content>
                                    Insert Row After
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile @click="commands.deleteRow">
                                <v-list-tile-content>
                                    Delete Row
                                </v-list-tile-content>
                            </v-list-tile>
                            <!-- <v-subheader>Column</v-subheader> -->
                            <v-list-tile @click="commands.addColumnBefore">
                                <v-list-tile-content>
                                    Insert Column Before
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile @click="commands.addColumnAfter">
                                <v-list-tile-content>
                                    Insert Column After
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile @click="commands.deleteColumn">
                                <v-list-tile-content>
                                    Delete Column
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-divider></v-divider>
                            <v-divider></v-divider>
                            <!-- <v-subheader>Actions</v-subheader> -->
                            <v-list-tile @click="commands.toggleCellMerge">
                                <v-list-tile-content>
                                    Combine Cells
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-divider></v-divider>
                            <v-list-tile @click="commands.deleteTable">
                                <v-list-tile-content>
                                    Delete table
                                </v-list-tile-content>
                            </v-list-tile>
                        </span>
                    </v-list>
                </v-menu>
            </div>
        </editor-menu-bar>
        <template v-if="showSource">
            <div>
                <fluro-code-editor @blur="blur" @focus="focus" class="fluro-editor-textarea" @input="sourceChange" v-model="model" lang="html" :height="300"></fluro-code-editor>
            </div>
        </template>
        <template v-if="!showSource">
            <editor-content @blur="blur" @focus="focus" class="fluro-editor-textarea" :editor="editor" />
            <!-- Suggestions -->
            <div class="suggestion-list" v-show="showSuggestions" ref="suggestions">
                <template v-if="filteredUsers.length">
                    <!-- <pre>{{filteredUsers}}</pre> -->
                    <div v-for="(persona, index) in filteredUsers" :key="persona._id" class="suggestion-list__item" :class="{ 'is-selected': navigatedUserIndex === index }" @click="selectUser(persona)">
                        <fluro-avatar left :id="persona" type="persona" />{{ persona.title }}
                    </div>
                </template>
                <div v-else class="suggestion-list__item is-empty">
                    No users found
                </div>
            </div>
        </template>
        <!-- <pre>{{model}}</pre> -->
        <!-- <v-btn small @click="showSource = !showSource">
            View Source <v-icon>code</v-icon>
        </v-btn> -->
    </div>
</template>
<script>
// Import the editor

import tippy from 'tippy.js';
import Fuse from 'fuse.js';
import FluroCodeEditor from './FluroCodeEditor.vue';
import Mention from './tiptap/mentions';
import Image from './tiptap/image';
import { Editor, EditorContent, EditorMenuBar, EditorFloatingMenu } from 'tiptap'
import {
    Blockquote,
    CodeBlock,
    HardBreak,
    Heading,
    HorizontalRule,
    OrderedList,
    // Image,
    BulletList,
    ListItem,
    TodoItem,
    TodoList,
    Bold,
    Code,
    Italic,
    Link,
    Strike,
    Underline,
    History,
    Table,
    TableHeader,
    TableCell,
    TableRow,
    Placeholder,
} from 'tiptap-extensions';


export default {
    data() {
        return {
            showSource: false,
            model: this.value,
            editor: null,
            //Mentions
            query: null,
            suggestionRange: null,
            filteredUsers: [],
            navigatedUserIndex: 0,
            insertMention: () => {},
            observer: null,
        }
    },
    computed: {
        showSuggestions() {
            return this.query || this.hasResults
        },
    },
    methods: {
        blur($event) {
            this.$emit('blur', $event);
        },
        focus($event) {
            this.$emit('focus', $event);
        },
        sourceChange(input) {
            this.model = input;
        },
        showImagePrompt(command) {
            const src = prompt('Enter the url of your image here')
            if (src !== null) {
                command({ src })
            }
        },
        // navigate to the previous item
        // if it's the first item, navigate to the last one
        upHandler() {
            this.navigatedUserIndex = ((this.navigatedUserIndex + this.filteredUsers.length) - 1) % this.filteredUsers.length
        },
        // navigate to the next item
        // if it's the last item, navigate to the first one
        downHandler() {
            this.navigatedUserIndex = (this.navigatedUserIndex + 1) % this.filteredUsers.length
        },
        enterHandler() {
            const user = this.filteredUsers[this.navigatedUserIndex]
            if (user) {
                this.selectUser(user)
            }
        },
        // we have to replace our suggestion text with a mention
        // so it's important to pass also the position of your suggestion text
        selectUser(user) {

            //console.log('SELECT USER', user);

            this.insertMention({
                range: this.suggestionRange,
                attrs: {
                    id: user._id,
                    mentionID: user.mentionID,
                    label: user.title,
                },
            })
            this.editor.focus()
        },
        // renders a popup with suggestions
        // tiptap provides a virtualNode object for using popper.js (or tippy.js) for popups
        renderPopup(node) {
            if (this.popup) {
                return
            }
            this.popup = tippy(node, {
                content: this.$refs.suggestions,
                trigger: 'mouseenter',
                interactive: true,
                theme: 'dark',
                placement: 'top-start',
                inertia: true,
                duration: [400, 200],
                showOnInit: true,
                arrow: true,
                arrowType: 'round',
            })
            // we have to update tippy whenever the DOM is updated
            if (MutationObserver) {
                this.observer = new MutationObserver(() => {
                    this.popup.popperInstance.scheduleUpdate()
                })
                this.observer.observe(this.$refs.suggestions, {
                    childList: true,
                    subtree: true,
                    characterData: true,
                })
            }
        },
        destroyPopup() {
            if (this.popup) {
                this.popup.destroy()
                this.popup = null
            }
            if (this.observer) {
                this.observer.disconnect()
            }
        },
    },
    props: {
        'value': {
            default: '',
            type: String,
        },
        'placeholder': {
            type: String,
        },
        'options': {
            default: function() {
                return {}
            },
            type: Object,
        },
    },
    components: {
        EditorMenuBar,
        EditorContent,
        FluroCodeEditor,
        EditorFloatingMenu,
    },
    created() {
        var self = this;
        var placeholderText = self.placeholder;


        //Create and set the editor
        this.editor = new Editor({
            // editorProps:[{
            //     transformPastedHTML:function(string) {
            //         //console.log('FUNNEL', string)
            //         return string;
            //     }
            // }],
            extensions: [
                // new Alignment(),
                new Placeholder({
                    emptyClass: 'placeholder-text',
                    emptyNodeText: self.placeholder,
                    showOnlyWhenEditable: true,
                }),
                new HorizontalRule(),
                new Blockquote(),
                new CodeBlock(),
                new HardBreak(),
                new Heading({ levels: [1, 2, 3] }),
                new BulletList(),
                new OrderedList(),
                new ListItem(),
                // new TodoItem(),
                // new TodoList(),
                new Image(),
                new Bold(),
                new Code(),
                new Italic(),
                new Link(),
                new Strike(),
                new Underline(),
                new History(),
                new Table(),
                new TableHeader(),
                new TableCell(),
                new TableRow(),
                new Mention({
                    // a list of all suggested items
                    items: function() {



                        // return self.$fluro.content.mention(query);

                        return [];
                        // return [
                        //     { id: 1, name: 'Philipp Kühn' },
                        //     { id: 2, name: 'Hans Pagel' },
                        //     { id: 3, name: 'Kris Siepert' },
                        //     { id: 4, name: 'Justin Schueler' },
                        // ]
                    },
                    // is called when a suggestion starts
                    onEnter: ({
                        items,
                        query,
                        range,
                        command,
                        virtualNode,
                    }) => {
                        this.query = query
                        this.filteredUsers = items
                        this.suggestionRange = range
                        this.renderPopup(virtualNode)
                        // we save the command for inserting a selected mention
                        // this allows us to call it inside of our custom popup
                        // via keyboard navigation and on click
                        this.insertMention = command
                    },
                    // is called when a suggestion has changed
                    onChange: ({
                        items,
                        query,
                        range,
                        virtualNode,
                    }) => {

                        var mentionInstance = this;

                        self.$fluro.content.mention(query, self.options.mentions).then(function(personas) {
                                mentionInstance.query = query
                                mentionInstance.filteredUsers = personas
                                mentionInstance.suggestionRange = range
                                mentionInstance.navigatedUserIndex = 0
                                mentionInstance.renderPopup(virtualNode)
                            })
                            .catch(function(err) {
                                //console.log('Error', err);
                                // this.query = query
                                // this.filteredUsers = items
                                // this.suggestionRange = range
                                // this.navigatedUserIndex = 0
                                // this.renderPopup(virtualNode)
                            });
                    },
                    // is called when a suggestion is cancelled
                    onExit: () => {
                        // reset all saved values
                        this.query = null
                        this.filteredUsers = []
                        this.suggestionRange = null
                        this.navigatedUserIndex = 0
                        this.destroyPopup()
                    },
                    // is called on every keyDown event while a suggestion is active
                    onKeyDown: ({ event }) => {
                        // pressing up arrow
                        if (event.keyCode === 38) {
                            this.upHandler()
                            return true
                        }
                        // pressing down arrow
                        if (event.keyCode === 40) {
                            this.downHandler()
                            return true
                        }
                        // pressing enter
                        if (event.keyCode === 13) {
                            this.enterHandler()
                            return true
                        }
                        return false
                    },
                    // is called when a suggestion has changed
                    // this function is optional because there is basic filtering built-in
                    // you can overwrite it if you prefer your own filtering
                    // in this example we use fuse.js with support for fuzzy search
                    // onFilter: (items, query) => {

                    //     //console.log('SEARCH', items, query);

                    //     if (!query) {
                    //         return items
                    //     }
                    //     const fuse = new Fuse(items, {
                    //         threshold: 0.2,
                    //         keys: ['name'],
                    //     })
                    //     return fuse.search(query)
                    // },
                }),
            ],
            onUpdate: ({ getHTML }) => {


                var HTML = getHTML();

                self.model = HTML;


                // self.$emit('input', HTML);
            },
            onBlur: self.blur,
            onFocus: self.focus,
        })


        //Add the model by default
        self.editor.setContent(self.model)
    },

    watch: {
        value(val) {
            this.model = val;
        },
        placeholder(newValue) {
            this.editor.extensions.options.placeholder.emptyNodeText = newValue
        },
        model(value) {

            // so cursor doesn't jump to start on typing
            if (value !== this.editor.getHTML()) {
                //console.log('SET CONTENT TO', this.model)
                this.editor.setContent(value)
            }

            this.$emit('input', value);
        }
    },

    beforeDestroy() {
        this.editor.destroy()
    },
}
</script>
<style lang="scss">
$color-black: #000;
$color-white: #fff;


.fluro-editor {
    margin-bottom: 15px;

    .ace_editor {
        border-radius: 5px;
        overflow: hidden;
    }





    .floating-menu {
        position: absolute;
        margin-top: -0.25rem;
        visibility: hidden;
        opacity: 0;
        transition: opacity 0.2s, visibility 0.2s;

        &.is-active {
            opacity: 1;
            visibility: visible;
        }
    }
}

.fluro-editor-toolbar {
    margin-bottom: 10px;

    .v-menu {
        display: inline;
    }

    // .active {
    //     color: #ff0066;
    // }

    .v-btn {
        margin: 3px;
    }
}

.fluro-editor-textarea {
    display: flex;
    flex-direction: column;
    min-height: 200px;
    overflow: hidden;

    &>div {
        flex: 1;
        padding: 15px;
        outline: none;
        border: 1px solid rgba(#000, 0.1);
        border-radius: 5px;
        overflow: auto;

        &:focus {
            // background: #fff;
            border: 1px solid rgba(#000, 0.4);

        }
    }

    .is-empty {
        &:before {
            opacity: 0.4;
            // display: block;
            // position: relative;
            background: #ff0066;
            content: attr(data-empty-text);
            float: left;
            // color: #aaa;
            pointer-events: none;
            height: 0;
            font-style: italic;
        }
    }



    // box-shadow: 0 2px 3px rgba(#000, 0.2);



    // ul[data-type="todo_list"] {
    //     padding-left: 0;
    // }

    // li[data-type="todo_item"] {
    //     display: flex;
    //     flex-direction: row;
    // }

    // .todo-checkbox {
    //     border: 2px solid $color-black;
    //     height: 0.9em;
    //     width: 0.9em;
    //     box-sizing: border-box;
    //     margin-right: 10px;
    //     margin-top: 0.3rem;
    //     user-select: none;
    //     -webkit-user-select: none;
    //     cursor: pointer;
    //     border-radius: 0.2em;
    //     background-color: transparent;
    //     transition: 0.4s background;
    // }

    // .todo-content {
    //     flex: 1;
    // }

    // li[data-done="true"] {
    //     text-decoration: line-through;
    // }

    // li[data-done="true"] .todo-checkbox {
    //     background-color: $color-black;
    // }

    // li[data-done="false"] {
    //     text-decoration: none;
    // }



    .tableWrapper {
        display: block;
        width: 100%;
        // background: #ff0066;

        table {
            width: 100%;
            border-collapse: collapse;


            tr,
            td {
                // outline: 1px solid #ddd;
                border: 1px solid rgba(#000, 0.2);
                padding: 10px;
            }
        }
    }


    mention {
        display: inline;
        background: rgba($color-black, 0.1);
        color: rgba($color-black, 0.6);
        font-size: 0.9rem;
        font-weight: 500;
        border-radius: 9px;
        padding: 0.3rem 0.5rem;
        white-space: nowrap;
    }


}





.mention-suggestion {
    color: rgba($color-black, 0.6);
}




.suggestion-list {
    font-family: 'font-proxima';
    padding: 0.2rem;
    border: 2px solid rgba($color-black, 0.1);
    font-size: 0.8rem;
    font-weight: bold;

    &__no-results {
        padding: 0.2rem 0.5rem;
    }

    &__item {
        border-radius: 5px;
        padding: 0.2rem 0.5rem;
        margin-bottom: 0.2rem;
        cursor: pointer;

        &:last-child {
            margin-bottom: 0;
        }

        &.is-selected,
        &:hover {
            background-color: rgba($color-white, 0.2);
        }

        &.is-empty {
            opacity: 0.5;
        }
    }
}

.tippy-tooltip.dark-theme {
    background-color: $color-black;
    padding: 0;
    font-size: 1rem;
    text-align: inherit;
    color: $color-white;
    border-radius: 5px;

    .tippy-backdrop {
        display: none;
    }

    .tippy-roundarrow {
        fill: $color-black;
    }

    .tippy-popper[x-placement^=top] & .tippy-arrow {
        border-top-color: $color-black;
    }

    .tippy-popper[x-placement^=bottom] & .tippy-arrow {
        border-bottom-color: $color-black;
    }

    .tippy-popper[x-placement^=left] & .tippy-arrow {
        border-left-color: $color-black;
    }

    .tippy-popper[x-placement^=right] & .tippy-arrow {
        border-right-color: $color-black;
    }
}
</style>