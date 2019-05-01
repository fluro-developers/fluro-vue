<template>
    <div>
        <editor-menu-bar :editor="editor">
            <div slot-scope="{ commands, isActive }">
                <v-btn icon small :class="{ 'is-active': isActive.bold() }" @click="commands.bold">
                    <v-icon>format_bold</v-icon>
                </v-btn>
                <v-btn icon small :class="{ 'is-active': isActive.italic() }" @click="commands.italic">
                    <v-icon>format_italic</v-icon>
                </v-btn>
                <v-btn icon small :class="{ 'is-active': isActive.underline() }" @click="commands.underline">
                    <v-icon>format_underline</v-icon>
                </v-btn>
                <v-btn icon small :class="{ 'is-active': isActive.strike() }" @click="commands.strike">
                    <v-icon>format_strikethrough</v-icon>
                </v-btn>
                <v-btn icon small :class="{ 'is-active': isActive.heading({ level: 1 }) }" @click="commands.heading({ level: 1 })">
                    H1
                </v-btn>
                <v-btn icon small :class="{ 'is-active': isActive.heading({ level: 2 }) }" @click="commands.heading({ level: 2 })">
                    H2
                </v-btn>
                <v-btn icon small :class="{ 'is-active': isActive.heading({ level: 3 }) }" @click="commands.heading({ level: 3 })">
                    H3
                </v-btn>
                <v-btn icon small :class="{ 'is-active': isActive.heading({ level: 4 }) }" @click="commands.heading({ level: 4 })">
                    H4
                </v-btn>
                <v-btn icon small :class="{ 'is-active': isActive.heading({ level: 5 }) }" @click="commands.heading({ level: 5 })">
                    H5
                </v-btn>
                <v-btn icon small :class="{ 'is-active': isActive.code_block() }" @click="commands.code_block">
                    <v-icon>code</v-icon>
                </v-btn>
                <!--  -->
                <v-btn icon small :class="{ 'is-active': isActive.todo_list() }" @click="commands.todo_list">
                    <v-icon>format_align_left</v-icon>
                </v-btn>
                <v-btn icon small :class="{ 'is-active': isActive.todo_list() }" @click="commands.todo_list">
                    <v-icon>format_align_center</v-icon>
                </v-btn>
                <v-btn icon small :class="{ 'is-active': isActive.todo_list() }" @click="commands.todo_list">
                    <v-icon>format_align_right</v-icon>
                </v-btn>
                <!--  -->
                <v-btn icon small :class="{ 'is-active': isActive.bullet_list() }" @click="commands.bullet_list">
                    <v-icon>format_list_bulleted</v-icon>
                </v-btn>
                <v-btn icon small :class="{ 'is-active': isActive.ordered_list() }" @click="commands.ordered_list">
                    <v-icon>format_list_numbered</v-icon>
                </v-btn>
                <v-btn icon small :class="{ 'is-active': isActive.blockquote() }" @click="commands.blockquote">
                    <v-icon>format_quote</v-icon>
                </v-btn>
                <v-btn icon small :class="{ 'is-active': isActive.horizontal_rule() }" @click="commands.horizontal_rule">
                    <v-icon>minimize</v-icon>
                </v-btn>
                <!--  -->
                <v-btn icon small @click="commands.undo">
                    <v-icon>undo</v-icon>
                </v-btn>
                <v-btn icon small @click="commands.redo">
                    <v-icon>redo</v-icon>
                </v-btn>
                <v-btn icon small :class="{ 'is-active': isActive.todo_list() }" @click="commands.todo_list">
                    <v-icon>check_box_outline</v-icon>
                </v-btn>
                <!--  <v-btn icon :class="{ 'is-active': isActive.OrderedList() }" @click="commands.OrderedList">
                    <v-icon>format_size</v-icon>
                </v-btn>

                <v-btn icon :class="{ 'is-active': isActive.OrderedList() }" @click="commands.OrderedList">
                    <v-icon>format_list_bullet</v-icon>
                </v-btn> -->
                <v-btn icon small @click="commands.createTable({rowsCount: 3, colsCount: 3, withHeaderRow: false })">
                    <v-icon>table</v-icon>
                </v-btn>
                <span v-if="isActive.table()">
                    <v-btn icon small @click="commands.deleteTable">
                        <v-icon>delete_table</v-icon>
                    </v-btn>
                    <v-btn icon small @click="commands.addColumnBefore">
                        <v-icon>add_col_before</v-icon>
                    </v-btn>
                    <v-btn icon small @click="commands.addColumnAfter">
                        <v-icon>add_col_after</v-icon>
                    </v-btn>
                    <v-btn icon small @click="commands.deleteColumn">
                        <v-icon>delete_col</v-icon>
                    </v-btn>
                    <v-btn icon small @click="commands.addRowBefore">
                        <v-icon>add_row_before</v-icon>
                    </v-btn>
                    <v-btn icon small @click="commands.addRowAfter">
                        <v-icon>add_row_after</v-icon>
                    </v-btn>
                    <v-btn icon small @click="commands.deleteRow">
                        <v-icon>delete_row</v-icon>
                    </v-btn>
                    <v-btn icon small @click="commands.toggleCellMerge">
                        <v-icon>combine_cells</v-icon>
                    </v-btn>
                </span>
            </div>
        </editor-menu-bar>
        <editor-content :editor="editor" />
    </div>
</template>
<script>
// Import the editor
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'

import {
    Blockquote,
    CodeBlock,
    HardBreak,
    Heading,
    HorizontalRule,
    OrderedList,
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
} from 'tiptap-extensions';




export default {
    props: {
        'value': {
            type: String,
        },
    },
    components: {
        EditorMenuBar,
        EditorContent,
    },
    mounted() {

        //Create and set the editor
        this.editor = new Editor({
            extensions: [
                new HorizontalRule(),
                new Blockquote(),
                new CodeBlock(),
                new HardBreak(),
                new Heading({ levels: [1, 2, 3] }),
                new BulletList(),
                new OrderedList(),
                new ListItem(),
                new TodoItem(),
                new TodoList(),
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
            ],
            onUpdate: ({ getHTML }) => {
                this.$emit('input', getHTML())
            },
        })

        //Add the model by default
        this.editor.setContent(this.model)
    },
    watch: {
        model(value) {
            // so cursor doesn't jump to start on typing
            if (value !== this.editor.getHTML()) {
                this.editor.setContent(value)
            }
        }
    },
    data() {
        return {
            model: this.value,
            editor: null,
        }
    },
    beforeDestroy() {
        this.editor.destroy()
    },
}
</script>