import sys
from moviepy.editor import VideoFileClip

if len(sys.argv) != 3:
    print("Usage: python File_Convetr.py <input_file> <output_file>")
    sys.exit(1)

input_file = sys.argv[1]
output_file = sys.argv[2]

video = VideoFileClip(input_file)
video.write_videofile(output_file, codec='libx264')
