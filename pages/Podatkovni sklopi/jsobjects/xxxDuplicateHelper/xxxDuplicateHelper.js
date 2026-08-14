export default {
  duplicateRow: async () => {
    try {
      const row = Tabela_sklopov.triggeredRow;

      if (!row || !row.id) {
        showAlert("No row selected to duplicate", "error");
        return;
      }

      // 1. Naloži celotne podatke izvirnega zapisa
      await get_a_dataset.run({ id: row.id });

      if (!get_a_dataset.data || !get_a_dataset.data[0]) {
        showAlert("Could not load source dataset", "error");
        return;
      }

      // 2. Ustvari kopijo glavnega zapisa
      const result = await insert_copy_dataset.run();
      const newId = Array.isArray(result) ? result[0]?.id : result?.id;

      if (!newId) {
        showAlert("Failed to create dataset copy", "error");
        return;
      }

      // 3. Osveži tabelo
      await GetView.run();

      // 4. Odpri novi zapis v modalu
      await storeValue("viewData", { id: newId });
      FormHelper.openViewModal();

      showAlert("Dataset successfully duplicated (ID: " + newId + ")", "success");

    } catch (error) {
      showAlert("Duplicate failed: " + (error.message || error), "error");
      console.error(error);
    }
  }
};