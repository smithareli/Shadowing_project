import React from 'react';
import {Pressable, Text, View, StyleSheet, Image} from 'react-native';

type Props = {
    editMode: boolean;
    saving:boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
};

export default function EditCycleUI({ editMode, saving, onEdit, onSave, onCancel }: Props) {
    if(!editMode) {
        return (
            <Pressable style= {[styles.button, styles.edit]} onPress={onEdit}>
                <Image source={require('@/assets/images/edit-cycle.png')} style={{ width: 24, height: 24 }} />
            </Pressable>
        );
    }
    return (
        <View style= {styles.row}>
            <Pressable style= {[styles.button, styles.save]} onPress={onSave} disabled={saving}>
                <Text>{saving ? 'Saving...' : 'Save'}</Text>
            </Pressable>
            <Pressable style= {[styles.button, styles.cancel]} onPress={onCancel}>
                <Text>Cancel</Text>
            </Pressable>
        </View>
    );
}
        
const styles = StyleSheet.create({
    row: { alignItems: 'center', gap: 10, marginTop: 16 },
    button: { paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8, marginTop: 16 },
    edit: { backgroundColor: '#d9d9d9' },
    save: { backgroundColor: '#d9d9d9', marginTop: 0 },
    cancel: { backgroundColor: '#757575', marginTop: 0 },
});