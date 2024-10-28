import nltk
from nltk.tokenize import word_tokenize
import numpy as np
import itertools
import random

def newsample(nnn, ratio):
    if ratio >len(nnn):
        return random.sample(nnn*(ratio//len(nnn)+1),ratio)
    else:
        return random.sample(nnn,ratio)

def preprocess_news_file(file):
    with open(file) as f:
        newsdata=f.readlines()

    news={}
    category={'None':0}
    subcategory={'None':0}

    for newsline in newsdata:
        line=newsline.strip().split('\t')
        news[line[1]]=[line[2],line[3],word_tokenize(line[6].lower()),word_tokenize(line[7].lower())]
        if line[2] not in category:
            category[line[2]]=len(category)
        if line[3] not in subcategory:
            subcategory[line[3]]=len(subcategory)
    word_dict_raw={'PADDING':[0,999999]}
    print(len(newsdata))

    for docid in news:
        for word in news[docid][2]:
            if word in word_dict_raw:
                word_dict_raw[word][1]+=1
            else:
                word_dict_raw[word]=[len(word_dict_raw),1]
        for word in news[docid][3]:
            if word in word_dict_raw:
                word_dict_raw[word][1]+=1
            else:
                word_dict_raw[word]=[len(word_dict_raw),1]
    word_dict={}
    for i in word_dict_raw:
        if word_dict_raw[i][1]>=3:
            word_dict[i]=[len(word_dict),word_dict_raw[i][1]]
    print(len(word_dict),len(word_dict_raw))

    news_words=[[0]*30]
    news_index={'0':0}
    for newsid in news:
        word_id=[]
        news_index[newsid]=len(news_index)
        for word in news[newsid][2]:
            if word in word_dict:
                word_id.append(word_dict[word][0])
        word_id=word_id[:30]
        news_words.append(word_id+[0]*(30-len(word_id)))
    news_words=np.array(news_words,dtype='int32')

    news_body=[[0]*300]
    for newsid in news:
        word_id=[]
        for word in news[newsid][3]:
            if word in word_dict:
                word_id.append(word_dict[word][0])
        word_id=word_id[:300]
        news_body.append(word_id+[0]*(300-len(word_id)))
    news_body=np.array(news_body,dtype='int32')
    news_v=[[0]]
    news_sv=[[0]]
    for newsid in news:
        news_v.append([category[news[newsid][0]]])
    for newsid in news:
        news_sv.append([subcategory[news[newsid][1]]])
    news_v=np.array(news_v,dtype='int32')
    news_sv=np.array(news_sv,dtype='int32')
    return word_dict,category,subcategory,news_words,news_body,news_v,news_sv,news_index

def preprocess_user_file(file, npratio=4):
    userid_dict={}
    with open(file) as f:
        userdata=f.readlines()
    for user in userdata:
        line=user.strip().split('\t')
        userid=line[0]
        if userid not in userid_dict:
            userid_dict[userid]=len(userid_dict)

    all_train_id=[]
    all_train_pn=[]
    all_label=[]

    all_test_id=[]
    all_test_pn=[]
    all_test_label=[]
    all_test_index=[]

    all_user_pos=[]
    all_test_user_pos=[]

    for user in userdata:
        line=user.strip().split('\t')
        userid=line[0]
        if len(line)==4:

            impre=[x.split('#TAB#') for x in line[2].split('#N#')]
        if len(line)==3:
            impre=[x.split('#TAB#') for x in line[2].split('#N#')]

        trainpos=[x[0].split() for x in impre]
        trainneg=[x[1].split() for x in impre]

        poslist=list(itertools.chain(*(trainpos)))
        neglist=list(itertools.chain(*(trainneg)))


        if len(line)==4:
            testimpre=[x.split('#TAB#') for x in line[3].split('#N#')]
            testpos=[x[0].split() for x in testimpre]
            testneg=[x[1].split() for x in testimpre]


            for i in range(len(testpos)):
                sess_index=[]
                sess_index.append(len(all_test_pn))
                posset=list(set(poslist))
                allpos=[int(p) for p in random.sample(posset,min(50,len(posset)))[:50]]
                allpos+=[0]*(50-len(allpos))


                for j in testpos[i]:
                    all_test_pn.append(int(j))
                    all_test_label.append(1)
                    all_test_id.append(userid_dict[userid])
                    all_test_user_pos.append(allpos)

                for j in testneg[i]:
                    all_test_pn.append(int(j))
                    all_test_label.append(0)
                    all_test_id.append(userid_dict[userid])
                    all_test_user_pos.append(allpos)
                sess_index.append(len(all_test_pn))
                all_test_index.append(sess_index)




        for impre_id in range(len(trainpos)):
            for pos_sample in trainpos[impre_id]:

                pos_neg_sample=newsample(trainneg[impre_id],npratio)
                pos_neg_sample.append(pos_sample)
                temp_label=[0]*npratio+[1]
                temp_id=list(range(npratio+1))
                random.shuffle(temp_id)


                shuffle_sample=[]
                shuffle_label=[]
                for id in temp_id:
                    shuffle_sample.append(int(pos_neg_sample[id]))
                    shuffle_label.append(temp_label[id])

                posset=list(set(poslist)-set([pos_sample]))
                allpos=[int(p) for p in random.sample(posset,min(50,len(posset)))[:50]]
                allpos+=[0]*(50-len(allpos))
                all_train_pn.append(shuffle_sample)
                all_label.append(shuffle_label)
                all_train_id.append(userid_dict[userid])
                all_user_pos.append(allpos)

    all_train_pn=np.array(all_train_pn,dtype='int32')
    all_label=np.array(all_label,dtype='int32')
    all_train_id=np.array(all_train_id,dtype='int32')
    all_test_pn=np.array(all_test_pn,dtype='int32')
    all_test_label=np.array(all_test_label,dtype='int32')
    all_test_id=np.array(all_test_id,dtype='int32')
    all_user_pos=np.array(all_user_pos,dtype='int32')
    all_test_user_pos=np.array(all_test_user_pos,dtype='int32')
    return userid_dict,all_train_pn,all_label,all_train_id,all_test_pn,all_test_label,all_test_id,all_user_pos,all_test_user_pos,all_test_index

def get_embedding(word_dict, word_embedding):
    embedding_dict={}
    cnt=0
    with open(word_embedding,'rb')as f:
        linenb=0
        while True:
            line=f.readline()
            if len(line)==0:
                break
            line = line.split()
            word=line[0].decode()
            linenb+=1
            if len(word) != 0:
                vec=[float(x) for x in line[1:]]
                if word in word_dict:
                    embedding_dict[word]=vec
                    if cnt%1000==0:
                        print(cnt,linenb,word)
                    cnt+=1

    embedding_matrix=[0]*len(word_dict)
    cand=[]
    for i in embedding_dict:
        embedding_matrix[word_dict[i][0]]=np.array(embedding_dict[i],dtype='float32')
        cand.append(embedding_matrix[word_dict[i][0]])
    cand=np.array(cand,dtype='float32')
    mu=np.mean(cand, axis=0)
    Sigma=np.cov(cand.T)
    norm=np.random.multivariate_normal(mu, Sigma, 1)
    for i in range(len(embedding_matrix)):
        if type(embedding_matrix[i])==int:
            embedding_matrix[i]=np.reshape(norm, 300)
    embedding_matrix[0]=np.zeros(300,dtype='float32')
    embedding_matrix=np.array(embedding_matrix,dtype='float32')
    print(embedding_matrix.shape)
    return embedding_matrix