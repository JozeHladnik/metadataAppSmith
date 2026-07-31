export default {
  openViewModal: () => {
    const row = Tabela_sklopov.triggeredRow;
    
    if (!row || Object.keys(row).length === 0) return;
    
    //const getIds = (dataArray) => Array.isArray(dataArray) ? dataArray.map(item => item.id) : [];
		const getIds = (dataArray) => {
			if (!Array.isArray(dataArray)) return [];
			return dataArray
				.map(item => item?.id ?? item?.value ?? item)
				.filter(id => id !== null && id !== undefined && id !== '')
				.map(id => Number(id));   // force number – change to String(id) if your options use strings
		};
		
    // NEW: Find the author where is_primary is true
    const primaryAuthor = row.authors_data && Array.isArray(row.authors_data) 
      ? row.authors_data.find(a => a.is_primary === true) 
      : null;

    // Format the data
    const formattedData = {
      // Standard Fields
      id: row.id,
      legacy_ref: row.legacy_ref,
      title: row.title,
      description: row.description,
      data_capture: row.data_capture,
      data_size: row.data_size,
      no_measurements: row.no_measurements,
      time_frame: row.time_frame,
      spatial_frame: row.spatial_frame,
      external: row.external,
      created_at: row.created_at,
      updated_at: row.updated_at,
      status_code: row.status_code,
			status_id: row.status_id,
      
      // Converted Relational Fields
      authors: getIds(row.authors_data),
            // NEW: Add the primary author ID to the form data
      primary_author: primaryAuthor ? primaryAuthor.id : null, 
			collections: getIds(row.collections_data),    // <--- ADDED	2
      //collections: getIds(row.collections_data || row.collection_data || row.collections),
			file_formats: getIds(row.file_formats_data),
			data_formats: getIds(row.data_formats_data),  // <--- ADDED	4
      instruments: getIds(row.instruments_data),
     // locations_stages: getIds(row.locations_stages_data), //imam ločeno
			partners: getIds(row.partners_data),
      protocol_types: getIds(row.protocol_types_data),
      protocols: getIds(row.protocols_data),
      purposes: getIds(row.purposes_data),
      restrictions: getIds(row.restrictions_data),
      sm: getIds(row.sm_data),
      sn: getIds(row.sn_data),
      sn_types: getIds(row.sn_types_data)
    };

    // Save the formatted data to the Appsmith store
    storeValue('viewData', formattedData);
    
		    // RUN THE QUERY, THEN OPEN THE MODAL
    get_loc_stage.run().then(() => {
      showModal('View_modal');
    });
		console.log("collections_data raw:", row.collections_data);
    console.log("collections ids:", getIds(row.collections_data));
    console.log("file_formats ids:", getIds(row.file_formats_data));
  },
// Dodano preverjanje!!!
	hasUnsavedChanges: () => {
    const clean = (obj) => {
      const out = {};
      for (const key in obj) {
        if (key === 'locations_stages') continue;
        let val = obj[key];
        if (Array.isArray(val)) {
          val = val.map(v => String(v)).sort();
        } else if (val === null || val === undefined) {
          val = '';
        } else {
          val = String(val).trim();
        }
        out[key] = val;
      }
      return out;
    };

    const a = clean(JSONForm1.formData);
    const b = clean(JSONForm1.sourceData);

    return !_.isEqual(a, b);
  }
}