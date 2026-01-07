import { StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// TODO: Replace ThemedText and ThemedView with actual components or remove if not used
// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  const navigation = useNavigation();
  
  return (
    <TouchableOpacity style={styles.container}>
      {/* <ThemedText type="title">This is a modal</ThemedText> */}
      <TouchableOpacity 
        style={styles.link}
        onPress={() => navigation.goBack()}
      >
        {/* <ThemedText type="link">Go to home screen</ThemedText> */}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
