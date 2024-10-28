import itertools
import keras
import random
import tensorflow as tf

from keras.layers import *
from keras.models import Model
from keras.optimizers import *

keras.backend.clear_session()

def generate_model(max_sent_length=30, max_body_length=300, max_sents=50, word_dict=None, embedding_mat=None, category=None, subcategory=None, npratio=4):
    title_input = Input(shape=(max_sent_length,), dtype='int32')

    body_input = Input(shape=(max_body_length,), dtype='int32')
    embedding_layer = Embedding(len(word_dict), 300, weights=[embedding_mat],trainable=True)

    embedded_sequences_title = embedding_layer(title_input)
    embedded_sequences_title=Dropout(0.2)(embedded_sequences_title)

    embedded_sequences_body = embedding_layer(body_input)
    embedded_sequences_body=Dropout(0.2)(embedded_sequences_body)

    title_cnn = Conv1D(filters=400, kernel_size=3,  padding='same', activation='relu', strides=1)(embedded_sequences_title)
    title_cnn=Dropout(0.2)(title_cnn)

    attention = Dense(200,activation='tanh')(title_cnn)
    attention = Flatten()(Dense(1)(attention))
    attention_weight = Activation('softmax')(attention)
    title_rep=keras.layers.Dot((1, 1))([title_cnn, attention_weight])

    body_cnn = Conv1D(filters=400, kernel_size=3,  padding='same', activation='relu', strides=1)(embedded_sequences_body)
    body_cnn=Dropout(0.2)(body_cnn)

    attention_body = Dense(200,activation='tanh')(body_cnn)
    attention_body = Flatten()(Dense(1)(attention_body))
    attention_weight_body = Activation('softmax')(attention_body)
    body_rep=keras.layers.Dot((1, 1))([body_cnn, attention_weight_body])

    vinput=Input((1,), dtype='int32')
    svinput=Input((1,), dtype='int32')
    v_embedding_layer = Embedding(len(category)+1, 50,trainable=True)
    sv_embedding_layer = Embedding(len(subcategory)+1, 50,trainable=True)
    v_embedding=Dense(400,activation='relu')(Flatten()(v_embedding_layer(vinput)))
    sv_embedding=Dense(400,activation='relu')(Flatten()(sv_embedding_layer(svinput)))

    all_channel=[title_rep,body_rep,v_embedding,sv_embedding]

    views=concatenate([Lambda(lambda x: tf.expand_dims(x,axis=1), output_shape=(4, 400))(channel) for channel in all_channel],axis=1)

    attentionv = Dense(200,activation='tanh')(views)

    attention_weightv =Lambda(lambda x:tf.squeeze(x,axis=-1), output_shape=(16,))(Dense(1)(attentionv))
    attention_weightv =Activation('softmax')(attention_weightv)

    newsrep=keras.layers.Dot((1, 1))([views, attention_weightv])

    newsEncoder = Model([title_input,body_input,vinput,svinput],newsrep)

    browsed_news_input = [keras.Input((max_sent_length,), dtype='int32') for _ in range(max_sents)]
    browsed_body_input = [keras.Input((max_body_length,), dtype='int32') for _ in range(max_sents)]

    browsed_v_input = [keras.Input((1,), dtype='int32') for _ in range(max_sents)]
    browsed_sv_input = [keras.Input((1,), dtype='int32') for _ in range(max_sents)]

    browsednews = [newsEncoder([browsed_news_input[_],browsed_body_input[_],browsed_v_input[_],browsed_sv_input[_] ]) for _ in range(max_sents)]
    browsednewsrep =concatenate([Lambda(lambda x: tf.expand_dims(x,axis=1), output_shape=(max_sents, 400))(news) for news in browsednews],axis=1)

    attentionn = Dense(200,activation='tanh')(browsednewsrep)
    attentionn =Flatten()(Dense(1)(attentionn))
    attention_weightn = Activation('softmax')(attentionn)
    user_rep=keras.layers.Dot((1, 1))([browsednewsrep, attention_weightn])

    candidates_title = [keras.Input((max_sent_length,), dtype='int32') for _ in range(1+npratio)]

    candidates_body = [keras.Input((max_body_length,), dtype='int32') for _ in range(1+npratio)]

    candidates_v = [keras.Input((1,), dtype='int32') for _ in range(1+npratio)]

    candidates_sv = [keras.Input((1,), dtype='int32') for _ in range(1+npratio)]
    candidate_vecs = [newsEncoder([candidates_title[_],candidates_body[_],candidates_v[_],candidates_sv[_]]) for _ in range(1+npratio)]

    logits = [keras.layers.dot([user_rep, candidate_vec], axes=-1) for candidate_vec in candidate_vecs]
    logits = keras.layers.Activation(keras.activations.softmax)(keras.layers.concatenate(logits))


    model = Model(candidates_title+browsed_news_input+candidates_body+browsed_body_input+
                candidates_v+browsed_v_input+candidates_sv+browsed_sv_input, logits)


    candidate_one_title = keras.Input((max_sent_length,))

    candidate_one_body = keras.Input((max_body_length,))

    candidate_one_v = keras.Input((1,))

    candidate_one_sv = keras.Input((1,))

    candidate_one_vec=newsEncoder([candidate_one_title,candidate_one_body,candidate_one_v,candidate_one_sv])

    score = keras.layers.Activation(keras.activations.sigmoid)(keras.layers.dot([user_rep, candidate_one_vec], axes=-1))
    model_test = keras.Model([candidate_one_title]+browsed_news_input+[candidate_one_body] +browsed_body_input
                            +[candidate_one_v]+browsed_v_input+[candidate_one_sv]+browsed_sv_input, score)


    model.compile(loss='categorical_crossentropy', optimizer=Adam(learning_rate=0.001), metrics=['acc'])

    return model, model_test