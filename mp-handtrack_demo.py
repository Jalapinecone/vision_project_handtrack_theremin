import numpy as np
from threading import Thread

import cv2
import os
import shutil
import sys

import time

sys.path.insert(0, "src/")

import src.multi_hand_tracker as mht
import src.plot_hand as plot_hand


N_THREADS = 8
cv2.setNumThreads(2)

palm_model_path = "./models/palm_detection_without_custom_op.tflite"
landmark_model_path = "./models/hand_landmark.tflite"
anchors_path = "./data/anchors.csv" 

detector = mht.MultiHandTracker(palm_model_path, landmark_model_path, anchors_path)

camera = cv2.VideoCapture(1)

frame_rate = 5
prev = 0

while camera.isOpened():

    time_elapsed = time.time() - prev
    res, image = camera.read()

    if time_elapsed > 1./frame_rate:
        prev = time.time()
        kp_list, box_list = detector(image)
        ## print out speed suggest the fps being processed
        print(1/time_elapsed)
        # plot_hand.plot_img(image,kp_list,box_list)


