export default {
    data() {
        return {
            selection: [],
        }
    },
    methods: {
        select(item) {
            var self = this;
            if (!self.isSelected(item)) {

                self.$set(self.selection, self.selection.length, item);
            }
        },
        setSelection(array) {
            this.selection = array.slice();
        },
        deselect(item) {
            var self = this;

            //Get the item ID
            var itemID = self.$fluro.utils.getStringID(item);

            //Find the index of the matching item
            var index = _.findIndex(self.selection, function(selectedItem) {
                var selectedItemID = self.$fluro.utils.getStringID(selectedItem);
                return itemID == selectedItemID;
            })

            //Splice the item out
            self.selection.splice(index, 1);
        },
        toggle(item) {
            var self = this;
            if (self.isSelected(item)) {
                self.deselect(item);
            } else {
                self.select(item);
            }

            //console.log('TOGGLE', self.selection);
        },
        deselectAll() {
            this.selection = [];
        },
        isSelected(item) {
            var self = this;
            var itemID = self.$fluro.utils.getStringID(item);

            //Check if the ID is already selected
            var match = _.some(self.selection, function(selectedItem) {
                var selectedItemID = self.$fluro.utils.getStringID(selectedItem);
                return itemID == selectedItemID;
            })

            return match;
        },

    }
}