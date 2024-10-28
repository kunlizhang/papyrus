import numpy as np
import pandas as pd
import pickle

def convert_user_data(input_path, id_mapping={}, output_path=None):
    """
    Creates a file with only train data

    input_path: path to the input file
    output_path: path to the output file

    Returns: df of the converted data format
    """
    TAB = "#TAB#"
    NLINE = "#N#"

    def get_pos_impre(impressions, pos=True):
        res = []
        for item in impressions.split(" "):
            if item.endswith("-1" if pos else "-0"):
                id = item.split("-")[0].strip("N")
                if id in id_mapping:
                    id = id_mapping[id]
                res.append(id)
        return res

    def combine_impre(row):
        combined = ""
        combined += " ".join(row['pos_impre'])
        combined += TAB
        combined += " ".join(row['neg_impre'])
        combined += TAB
        combined += row['time']
        return combined

    def join_impre(series):
        return pd.Series({"all_impre": NLINE.join(x for x in series)})

    raw_df = pd.read_csv(input_path, sep='\t', header=None)
    raw_df.columns = ['impre_id', 'user_id', 'time', 'history', 'impressions']

    raw_df['pos_impre'] = raw_df['impressions'].apply(get_pos_impre)
    raw_df['neg_impre'] = raw_df['impressions'].apply(get_pos_impre, pos=False)
    raw_df['all_impre'] = raw_df.apply(combine_impre, axis=1)


    grouped_df = raw_df.groupby('user_id', as_index=False).agg({'all_impre': join_impre})
    grouped_df['type'] = "M"

    result_df = grouped_df[["user_id", "type", "all_impre"]]

    if output_path:
        result_df.to_csv(output_path, sep='\t', index=False, header=False)
    
    return result_df 

def convert_news_data(input_path, output_path=None, idx_map_output=None):
    """
    input_path: path to the input file
    output_path: path to the output file

    Returns: df of the converted data format
    """
    def generate_index_map(idxs):
        res_map = {}
        for i, idx in enumerate(idxs):
            res_map[idx] = str(i)
        return res_map

    raw_df = pd.read_csv(input_path, sep='\t', header=None).reset_index()

    raw_df.columns = ['index', 'news_id', 'cat_big', 'cat_small', 'title', 'blurb', 'url', 'foo', 'fib']
    raw_df['news_id'] = raw_df['news_id'].str.strip("N")
    raw_df['foo'] = ''
    raw_df['fib'] = ''
    raw_df['blurb'] = raw_df['blurb'].fillna(" ")
    raw_df.loc[raw_df['blurb'] == " ", 'blurb'] = raw_df['title']
    raw_df = raw_df[['index', 'news_id', 'cat_big', 'cat_small', 'foo', 'fib', 'title', 'blurb']]

    index_map = generate_index_map(raw_df['news_id'].values)

    raw_df['news_id'] = raw_df['news_id'].map(index_map)

    if output_path:
        raw_df.to_csv(output_path, sep='\t', index=False, header=False)

    if idx_map_output:
        with open(idx_map_output, 'wb') as f:
            pickle.dump(index_map, f)

    return raw_df, index_map