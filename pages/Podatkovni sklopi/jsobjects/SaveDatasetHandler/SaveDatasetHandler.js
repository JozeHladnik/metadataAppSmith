export default {
    saveAll: async () => {
        try {
            const excludeFields = ['locations_stages', 'legacy_ref', 'created_at'];
            const original = _.omit(appsmith.store.viewData, excludeFields);
            const current = _.omit(JSONForm1.formData, excludeFields);

            // Fallback: if a field is missing from formData, treat it as unchanged (use original value)
            const fieldsNotInForm = ['external', 'status_code'];
            fieldsNotInForm.forEach(key => {
                if (current[key] === undefined) {
                    current[key] = original[key];
                }
            });

            // Same hasChanged helper, but based on the store/form diff
            const hasChanged = (field) => !_.isEqual(original[field], current[field]);

            const tasks = [];

            // 1. Main dataset fields
            const mainFields = [
                'title',
                'description',
                'data_capture',
                'data_size',
                'no_measurements',
                'status_id',
                'time_frame',
                'spatial_frame',
                'external'
            ];

            if (mainFields.some(field => hasChanged(field))) {
                tasks.push(update_dataset.run());
            }

            // 2. Junction table fields
            if (hasChanged('authors') || hasChanged('primary_author')) {
                tasks.push(update_authors.run());
            }
            if (hasChanged('collections')) tasks.push(update_collections.run());
            if (hasChanged('file_formats')) tasks.push(update_file_formats.run());
            if (hasChanged('data_formats')) tasks.push(update_formats.run());
            if (hasChanged('instruments')) tasks.push(update_instruments.run());
            if (hasChanged('partners')) tasks.push(update_partners.run());
            if (hasChanged('protocol_types')) tasks.push(update_protocol_types.run());
            if (hasChanged('protocols')) tasks.push(update_protocols.run());
            if (hasChanged('purposes')) tasks.push(update_purposes.run());
            if (hasChanged('restrictions')) tasks.push(update_restrictions.run());
            if (hasChanged('sm')) tasks.push(update_sm.run());
            if (hasChanged('sn')) tasks.push(update_sn.run());
            if (hasChanged('sn_types')) tasks.push(update_sn_types.run());

            // 3. Execution & UI Refresh
            if (tasks.length > 0) {
                await Promise.all(tasks);
                showAlert(`Saved successfully! (${tasks.length} component(s) updated)`, 'success');
            } else {
                showAlert('No changes detected.', 'info');
            }

            closeModal('View_modal');

            // Refresh the main table query
            await GetView.run();

        } catch (error) {
            showAlert('Failed to save dataset: ' + (error.message || error), 'error');
        }
    }
}