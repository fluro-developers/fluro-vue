
export default {
    methods: {
        select(item) {
            var self = this;
            if (!self.isSelected(item)) {

                self.$set(self.model, self.model.length, item);
            }
        },
        setSelection(array) {
            this.model = array.slice();
        },
        deselect(item) {
            var self = this;

            //Get the item ID
            var itemID = self.$fluro.utils.getStringID(item);

            //Find the index of the matching item
            var index = _.findIndex(self.model, function(selectedItem) {
                var selectedItemID = self.$fluro.utils.getStringID(selectedItem);
                return itemID == selectedItemID;
            })

            //Splice the item out
            self.model.splice(index, 1);
        },
        toggle(item) {
            var self = this;
            if (self.isSelected(item)) {
                self.deselect(item);
            } else {
                self.select(item);
            }

            //console.log('TOGGLE', self.model);
        },
        deselectAll() {
            this.model = [];
        },
        isSelected(item) {
            var self = this;
            var itemID = self.$fluro.utils.getStringID(item);

            //Check if the ID is already selected
            var match = _.some(self.model, function(selectedItem) {
                var selectedItemID = self.$fluro.utils.getStringID(selectedItem);
                return itemID == selectedItemID;
            })

            return match;
        },

    }
}