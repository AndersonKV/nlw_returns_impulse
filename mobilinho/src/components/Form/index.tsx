import React, {useCallback, useRef, useState} from 'react';
import {View, Text, TextInput, Image, TouchableOpacity} from 'react-native';
import {ArrowLeft} from 'phosphor-react-native';
import ViewShot, {captureScreen} from 'react-native-view-shot';
//import * as FileSystem from 'expo-file-system';
import FileSystem from 'react-native-fs';

import {FeedbackType} from '../../components/Widget';
import {feedbackTypes} from '../../utils/feedbackTypes';
import {ScreenshotButton} from '../../components/ScreenShotButton';
import {Button} from '../../components/Button';
import {api} from '../../libs/api';

import {theme} from '../../theme';
import {styles} from './styles';

interface Props {
  feedbackType: FeedbackType;
  onFeedbackCanceled: () => void;
  onFeedbackSent: () => void;
}

//npm start -- --reset-cache

export function Form({
  feedbackType,
  onFeedbackCanceled,
  onFeedbackSent,
}: Props) {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isSendingFeedback, setIsSendingFeedback] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');
  const feedbackTypeInfo = feedbackTypes[feedbackType];

  function handleScreenshot() {
    captureScreen({
      format: 'jpg',
      quality: 0.8,
    })
      .then(uri => setScreenshot(uri))
      .catch(error => console.error(error));
  }

  function handleScreenshotRemove() {
    setScreenshot(null);
  }

  async function handleSendFeedback() {
    if (isSendingFeedback) {
      return;
    }

    setIsSendingFeedback(true);

    const screenshotBase64 =
      screenshot &&
      (await FileSystem.readFile(screenshot, {encoding: 'base64'}));

    console.log('passou');
    try {
      await api.post('/feedbacks', {
        type: feedbackType,
        screenshot: `data:image/png;base64, ${screenshotBase64}`,
        comment,
      });
      console.log('passou2');

      onFeedbackSent();
    } catch (error) {
      console.log('passou3');

      console.error(error);
      setIsSendingFeedback(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onFeedbackCanceled}>
          <ArrowLeft
            size={24}
            weight="bold"
            color={theme.colors.surface_secondary}
          />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Image style={styles.image} source={feedbackTypeInfo.image} />
          <Text style={styles.titleText}>{feedbackTypeInfo.title}</Text>
        </View>
      </View>
      <TextInput
        multiline
        style={styles.input}
        placeholder="Descreva detalhadamente o que est?? a acontecer..."
        placeholderTextColor={theme.colors.text_on_brand_color}
        autoCorrect={false}
        onChangeText={setComment}
      />

      <View style={styles.footer}>
        <ScreenshotButton
          onTakeShot={handleScreenshot}
          onRemoveShot={handleScreenshotRemove}
          screenshot={screenshot}
        />
        <Button onPress={handleSendFeedback} isLoading={isSendingFeedback} />
      </View>
    </View>
  );
}
