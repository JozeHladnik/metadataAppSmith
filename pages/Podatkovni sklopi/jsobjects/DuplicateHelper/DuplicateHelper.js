export default {
  duplicateRow: async () => {
    try {
      const row = Tabela_sklopov.triggeredRow;

      if (!row || !row.id) {
        showAlert("No row selected to duplicate", "error");
        return;
      }

      const oldId = Number(row.id);

      // 1. Kopija glavnega zapisa (SQL mora uporabiti this.params.sourceId + RETURNING id)
      const result = await insert_copy_dataset.run({ sourceId: oldId });
      const newId = Number(
        Array.isArray(result) ? result[0]?.id : (result?.id ?? insert_copy_dataset.data?.[0]?.id)
      );

      if (!newId) {
        showAlert("Failed to create dataset copy", "error");
        return;
      }

      // 2. Kopija vseh junction tabel: oldId → newId
      await copy_dataset_junctions.run({ oldId, newId });

      // 3. Osveži tabelo in odpri novi zapis
      await GetView.run();
      await storeValue("viewData", { id: newId });
      FormHelper.openViewModal();

      showAlert("Dataset successfully duplicated (ID: " + newId + ")", "success");
    } catch (error) {
      showAlert("Duplicate failed: " + (error.message || error), "error");
      console.error(error);
    }
  }
};