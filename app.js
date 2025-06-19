Ext.onReady(function () {
    Ext.tip.QuickTipManager.init();

    var storeTrabajadores = Ext.create('Ext.data.Store', {
        fields: ['tra_ide', 'tra_cod', 'tra_nom', 'tra_pat', 'tra_mat'],
        proxy: {
            type: 'ajax',
            url: 'php/trabajador.php',
            extraParams: { action: 'lista' },
            reader: { type: 'json', root: 'data' }
        },
        autoLoad: true
    });

    function mostrarFormularioTrabajador(record) {
        var isEdit = !!record;

        var form = Ext.create('Ext.form.Panel', {
            bodyPadding: 10,
            defaults: { xtype: 'textfield', anchor: '100%', allowBlank: false },
            items: [
                { name: 'tra_cod', fieldLabel: 'Codigo' },
                { name: 'tra_nom', fieldLabel: 'Nombre' },
                { name: 'tra_pat', fieldLabel: 'Apellido Paterno' },
                { name: 'tra_mat', fieldLabel: 'Apellido Materno' },
                { xtype: 'hidden', name: 'tra_ide' },
                { xtype: 'hidden', name: 'action', value: isEdit ? 'modificar' : 'insertar' }
            ],
            buttons: [
                {
                    text: 'Guardar',
                    formBind: true,
                    handler: function () {
                        Ext.Ajax.request({
                            url: 'php/trabajador.php',
                            method: 'POST',
                            params: form.getValues(),
                            success: function () {
                                storeTrabajadores.load();
                                form.up('window').close();
                            }
                        });
                    }
                },
                {
                    text: 'Cancelar',
                    handler: function () {
                        form.up('window').close();
                    }
                }
            ]
        });

        if (isEdit) form.getForm().setValues(record.data);

        Ext.create('Ext.window.Window', {
            title: isEdit ? 'Modificar Trabajador' : 'Nuevo Trabajador',
            modal: true,
            width: 400,
            layout: 'fit',
            items: [form]
        }).show();
    }

    function abrirTrabajadorWindow() {
        var gridTrabajadores = Ext.create('Ext.grid.Panel', {
            store: storeTrabajadores,
            columns: [
                { text: 'ID', dataIndex: 'tra_ide', width: 50 },
                { text: 'Codigo', dataIndex: 'tra_cod', width: 80 },
                { text: 'Nombre', dataIndex: 'tra_nom', flex: 1 },
                { text: 'Apellido Paterno', dataIndex: 'tra_pat', flex: 1 },
                { text: 'Apellido Materno', dataIndex: 'tra_mat', flex: 1 }
            ],
            selModel: 'rowmodel',
            tbar: [
                {
                    text: 'Nuevo',
                    handler: function () {
                        mostrarFormularioTrabajador(null);
                    }
                },
                {
                    text: 'Modificar',
                    handler: function () {
                        var record = gridTrabajadores.getSelectionModel().getSelection()[0];
                        if (record) mostrarFormularioTrabajador(record);
                        else Ext.Msg.alert('Atencion', 'Seleccione un trabajador.');
                    }
                },
                {
                    text: 'Eliminar',
                    handler: function () {
                        var record = gridTrabajadores.getSelectionModel().getSelection()[0];
                        if (record) {
                            Ext.Msg.confirm('Confirmar', 'Esta seguro de eliminar?', function (btn) {
                                if (btn === 'yes') {
                                    Ext.Ajax.request({
                                        url: 'php/trabajador.php',
                                        method: 'POST',
                                        params: { action: 'eliminar', tra_ide: record.get('tra_ide') },
                                        success: function () {
                                            storeTrabajadores.load();
                                        }
                                    });
                                }
                            });
                        } else Ext.Msg.alert('Atencion', 'Seleccione un trabajador.');
                    }
                }
            ]
        });

        Ext.create('Ext.window.Window', {
            title: 'Gestion de Trabajadores',
            width: 800,
            height: 400,
            layout: 'fit',
            modal: true,
            items: [gridTrabajadores]
        }).show();
    }

    var storeCabecera = Ext.create('Ext.data.Store', {
        fields: ['ven_ide', 'ven_ser', 'ven_num', 'ven_cli', 'ven_mon'],
        proxy: {
            type: 'ajax',
            url: 'php/venta.php',
            extraParams: { action: 'read' },
            reader: { type: 'json', root: 'data' }
        },
        autoLoad: true
    });

    var storeDetalleVisual = Ext.create('Ext.data.Store', {
        fields: ['v_d_ide', 'ven_ide', 'v_d_pro', 'v_d_uni', 'v_d_can', 'v_d_tot', 'est_ado'],
        proxy: {
            type: 'ajax',
            url: 'php/venta.php',
            reader: { type: 'json', root: 'data' }
        }
    });

    var storeDetalleEdicion = Ext.create('Ext.data.Store', {
        fields: ['v_d_ide', 'ven_ide', 'v_d_pro', 'v_d_uni', 'v_d_can', 'v_d_tot', 'est_ado'],
        proxy: {
            type: 'ajax',
            url: 'php/venta.php',
            reader: { type: 'json', root: 'data' }
        }
    });

    function abrirFormularioVenta(record) {
        var isEdit = !!record;

        var form = Ext.create('Ext.form.Panel', {
            bodyPadding: 10,
            defaults: { xtype: 'textfield', anchor: '100%', allowBlank: false },
            items: [
                { name: 'ven_ser', fieldLabel: 'Serie' },
                { name: 'ven_num', fieldLabel: 'Numero' },
                { name: 'ven_cli', fieldLabel: 'Cliente' },
                { xtype: 'numberfield', name: 'ven_mon', fieldLabel: 'Monto', minValue: 0, decimalPrecision: 2 },
                { xtype: 'hidden', name: 'ven_ide' }
            ]
        });

        var gridDetalleEdicion = Ext.create('Ext.grid.Panel', {
            store: storeDetalleEdicion,
            height: 300,
            plugins: [Ext.create('Ext.grid.plugin.CellEditing', { clicksToEdit: 1 })],
            columns: [
                { text: 'ID', dataIndex: 'v_d_ide', width: 50 },
                { text: 'Producto', dataIndex: 'v_d_pro', flex: 1, editor: { xtype: 'textfield' } },
                { text: 'Precio Unitario', dataIndex: 'v_d_uni', width: 120, editor: { xtype: 'numberfield' } },
                { text: 'Cantidad', dataIndex: 'v_d_can', width: 120, editor: { xtype: 'numberfield' } },
                { text: 'Total', dataIndex: 'v_d_tot', width: 120 },
                { text: 'Estado', dataIndex: 'est_ado', width: 80, editor: { xtype: 'numberfield', minValue: 0, maxValue: 1 } }
            ],
            tbar: [
                {
                    text: 'Agregar Detalle',
                    handler: function () {
                        storeDetalleEdicion.insert(0, {
                            v_d_ide: 0, ven_ide: 0, v_d_pro: '', v_d_uni: 0, v_d_can: 0, v_d_tot: 0, est_ado: 1
                        });
                    }
                },
                {
                    text: 'Eliminar Detalle',
                    handler: function () {
                        var sel = gridDetalleEdicion.getSelectionModel().getSelection();
                        if (sel.length) storeDetalleEdicion.remove(sel);
                    }
                }
            ]
        });

        var win = Ext.create('Ext.window.Window', {
            title: isEdit ? 'Modificar Venta' : 'Nueva Venta',
            width: 700,
            height: 650,
            modal: true,
            layout: 'vbox',
            items: [form, gridDetalleEdicion],
            buttons: [
                {
                    text: 'Guardar',
                    handler: function () {
                        var values = form.getValues();
                        values.action = isEdit ? 'update' : 'create';

                        Ext.Ajax.request({
                            url: 'php/venta.php',
                            method: 'POST',
                            params: values,
                            success: function (response) {
                                var res = Ext.decode(response.responseText);
                                var ven_ide = isEdit ? record.get('ven_ide') : res.ven_ide;

                                storeDetalleEdicion.each(function (det) {
                                    det.set('ven_ide', ven_ide);
                                });

                                var total = storeDetalleEdicion.getCount();
                                var done = 0;

                                storeDetalleEdicion.each(function (det) {
                                    Ext.Ajax.request({
                                        url: 'php/venta.php',
                                        method: 'POST',
                                        params: {
                                            action: 'save_detalle',
                                            v_d_ide: det.get('v_d_ide'),
                                            ven_ide: ven_ide,
                                            v_d_pro: det.get('v_d_pro'),
                                            v_d_uni: det.get('v_d_uni'),
                                            v_d_can: det.get('v_d_can'),
                                            est_ado: det.get('est_ado')
                                        },
                                        callback: function () {
                                            done++;
                                            if (done === total) {
                                                storeCabecera.load();
                                                storeDetalleVisual.load({
                                                    params: { action: 'read_detalle', ven_ide: ven_ide }
                                                });
                                                win.close();
                                            }
                                        }
                                    });
                                });
                            }
                        });
                    }
                },
                {
                    text: 'Cancelar',
                    handler: function () {
                        win.close();
                    }
                }
            ]
        });

        if (isEdit) {
            form.getForm().setValues(record.data);
            storeDetalleEdicion.load({
                params: { action: 'read_detalle', ven_ide: record.get('ven_ide') }
            });
        } else {
            storeDetalleEdicion.removeAll();
            storeDetalleEdicion.insert(0, { v_d_ide: 0, ven_ide: 0, v_d_pro: '', v_d_uni: 0, v_d_can: 0, v_d_tot: 0, est_ado: 1 });
        }

        win.show();
    }

    function abrirVentanaGestionVentas() {
        var gridCabecera = Ext.create('Ext.grid.Panel', {
            store: storeCabecera,
            flex: 1,
            title: 'Ventas',
            columns: [
                { text: 'ID', dataIndex: 'ven_ide', width: 50 },
                { text: 'Serie', dataIndex: 'ven_ser', width: 80 },
                { text: 'Numero', dataIndex: 'ven_num', width: 100 },
                { text: 'Cliente', dataIndex: 'ven_cli', flex: 1 },
                { text: 'Monto', dataIndex: 'ven_mon', width: 100 }
            ],
            listeners: {
                select: function (_, record) {
                    storeDetalleVisual.load({
                        params: { action: 'read_detalle', ven_ide: record.get('ven_ide') }
                    });
                }
            }
        });

        var gridDetalle = Ext.create('Ext.grid.Panel', {
            store: storeDetalleVisual,
            flex: 1,
            title: 'Detalle de la Venta',
            columns: [
                { text: 'ID', dataIndex: 'v_d_ide', width: 50 },
                { text: 'Producto', dataIndex: 'v_d_pro', flex: 1 },
                { text: 'Precio Unitario', dataIndex: 'v_d_uni', width: 120 },
                { text: 'Cantidad', dataIndex: 'v_d_can', width: 120 },
                { text: 'Total', dataIndex: 'v_d_tot', width: 120 },
                { text: 'Estado', dataIndex: 'est_ado', width: 80 }
            ]
        });

        Ext.create('Ext.window.Window', {
            title: 'Gestion de Ventas',
            width: 1000,
            height: 600,
            layout: { type: 'vbox', align: 'stretch' },
            items: [gridCabecera, gridDetalle],
            buttons: [
                { text: 'Nuevo', handler: function () { abrirFormularioVenta(null); } },
                {
                    text: 'Modificar',
                    handler: function () {
                        var rec = gridCabecera.getSelectionModel().getSelection()[0];
                        if (rec) abrirFormularioVenta(rec);
                        else Ext.Msg.alert('Atencion', 'Seleccione una venta.');
                    }
                },
                {
                    text: 'Eliminar',
                    handler: function () {
                        var rec = gridCabecera.getSelectionModel().getSelection()[0];
                        if (rec) {
                            Ext.Msg.confirm('Confirmar', 'Eliminar venta?', function (btn) {
                                if (btn === 'yes') {
                                    Ext.Ajax.request({
                                        url: 'php/venta.php',
                                        method: 'POST',
                                        params: { action: 'delete', ven_ide: rec.get('ven_ide') },
                                        success: function () {
                                            storeCabecera.load();
                                            storeDetalleVisual.removeAll();
                                        }
                                    });
                                }
                            });
                        } else Ext.Msg.alert('Atencion', 'Seleccione una venta.');
                    }
                }
            ]
        }).show();
    }

    Ext.create('Ext.panel.Panel', {
        title: 'Menu Principal',
        width: 320,
        height: 220,
        bodyPadding: 20,
        renderTo: Ext.getBody(),
        layout: 'vbox',
        defaults: { margin: '10 0' },
        items: [
            { xtype: 'button', text: 'Gestionar Trabajadores', width: 260, handler: abrirTrabajadorWindow },
            { xtype: 'button', text: 'Gestionar Ventas', width: 260, handler: abrirVentanaGestionVentas }
        ]
    });
});
