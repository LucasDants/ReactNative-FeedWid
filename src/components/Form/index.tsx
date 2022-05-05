import { ArrowLeft } from 'phosphor-react-native';
import React, { useState } from 'react';
import { Image, Text, TextInput, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { theme } from '../../theme';
import { feedbackTypes } from '../../utils/feedbackTypes';
import { Button } from '../Button';
import { captureScreen } from 'react-native-view-shot'
import { ScreenshotButton } from '../ScreenshotButton';
import { FeedBackType } from '../Widget';

import styles from './styles';
import FileSystem from 'expo-file-system';

interface Props {
  feedbackType: FeedBackType
  onFeedbackCanceled: () => void
  onFeedbackSent: () => void
}

export function Form({ feedbackType, onFeedbackCanceled, onFeedbackSent }: Props) {
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [comment, setComment] = useState('')
  
  const feedbackTypeInfo = feedbackTypes[feedbackType]

  function handleScreenshot() {
    captureScreen({
      format: 'jpg',
      quality: 0.8,
    }).then(uri => setScreenshot(uri))
    .catch(err => console.log(err))
  }

  function handleScreenshotRemove() {
    setScreenshot(null)
  }

  async function handleSendFeedback() {
    if(loading) {
      return
    }
    setLoading(true)

    const screenshotBase64 = screenshot && await FileSystem.readAsStringAsync(screenshot, { encoding: 'base64' })

    const screenshotToSendBackend = `data:image/png, ${screenshotBase64}`

    setLoading(false)
    onFeedbackSent()
    return
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onFeedbackCanceled}>
          <ArrowLeft size={24} weight="bold" color={theme.colors.text_secondary} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Image source={feedbackTypeInfo.image} style={styles.image} />
          <Text style={styles.title}>
            {feedbackTypeInfo.title}
          </Text>
        </View>
      </View>
      <TextInput 
        multiline
        style={styles.input}
        placeholder='Algo não está funcionando bem? Queremos corrigir. Conte com detalhes o que está acontecendo'
        placeholderTextColor={theme.colors.text_secondary}
        autoCorrect={false}
        onChangeText={setComment}
        value={comment}
      />
      <View style={styles.footer}>
        <ScreenshotButton onTakeShot={handleScreenshot} onRemoveShot={handleScreenshotRemove} screenshot={screenshot} />
        <Button isLoading={loading} onPress={handleSendFeedback} />
      </View>
    </View>
  );
}