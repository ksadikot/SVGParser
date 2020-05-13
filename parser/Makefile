CFLAGS = -Wall -g -std=c11
ROOT = ../
INC = include/
SRC = src/
VFLAGS = --show-leak-kinds=all --leak-check=full --track-origins=yes --log-file=valgrind-out.txt
XML_PATH = /usr/include/libxml2

# Standard common makefile
parser: $(ROOT)libsvgparse.so

$(ROOT)libsvgparse.so: SVGParser.o LinkedListAPI.o
	gcc -shared -o $(ROOT)libsvgparse.so SVGParser.o LinkedListAPI.o -lxml2 -lm

SVGParser.o: $(SRC)SVGParser.c $(INC)LinkedListAPI.h $(INC)SVGParser.h
	gcc -c -fpic $(CFLAGS) -I$(XML_PATH) -I$(INC) $(SRC)SVGParser.c -o SVGParser.o

LinkedListAPI.o: $(SRC)LinkedListAPI.c $(INC)LinkedListAPI.h
	gcc -c -fpic $(CFLAGS) -I$(INC) $(SRC)LinkedListAPI.c -o LinkedListAPI.o

valgrind:
	valgrind $(VFLAGS) test1pre testFiles

clean:
	rm *.o $(ROOT)*.so
