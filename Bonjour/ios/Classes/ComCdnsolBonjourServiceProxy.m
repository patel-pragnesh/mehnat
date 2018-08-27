//
//  ComCdnsolBonjourServiceProxy.m
//  Bonjour
//
//  Created by VinayBhavsar on 31/07/18.
//

#import "ComCdnsolBonjourServiceProxy.h"
#import "BSBonjourServer.h"
#import <TiUtils.h>

@interface ComCdnsolBonjourServiceProxy () <BSBonjourServerDelegate>

@property (nonatomic, strong) BSBonjourServer *bonjourManager;
@property (nonatomic, strong) BSBonjourConnection *connection;

@end

@implementation ComCdnsolBonjourServiceProxy

-(id)init
{
    self = [super init];
    if (self != nil) {
        self.bonjourManager = [[BSBonjourServer alloc] initWithServiceType:@"gongchacfd" transportProtocol:@"tcp" delegate:self];
    }
    return self;
}

#pragma Public APIs

- (void)publish:(id)args
{
    [self.bonjourManager publish];
}

- (void)unPublish:(id)args
{
    [self.bonjourManager unpublish];
}

- (void)clearBuffer:(id)args
{
    if(self.connection != nil){
        [self.connection clearBuffer];
    }
}

- (void)sendData:(id)args
{
    if(self.connection != nil){
        NSString *data = [TiUtils stringValue:[args objectAtIndex:0]];
        [self.connection sendData:[data dataUsingEncoding:NSUTF8StringEncoding]];
    }
}

- (void)connectionAttemptFailed:(BSBonjourConnection *)connection {
    self.connection = nil;
    [self fireEvent:@"connectionfailed" withObject:nil];
}

- (void)connectionEstablished:(BSBonjourConnection *)connection {
    self.connection = connection;
    [self fireEvent:@"connectionestablished" withObject:nil];
}

- (void)connectionTerminated:(BSBonjourConnection *)connection {
    self.connection = nil;
    [self fireEvent:@"connectionterminated" withObject:nil];
}

- (void)publishFailed:(NSError *)error {
    NSLog(@"Published encountered an error: %@", error.localizedDescription);
    [self fireEvent:@"publishFailed" withObject:nil];
}

- (void)published:(NSString *)name {
    NSLog(@"Published with name: %@", name);
//    self.identifier = [[[UIDevice currentDevice] identifierForVendor] UUIDString];
    [self fireEvent:@"published" withObject:nil];
}

- (void)receivedData:(NSData *)data {
    NSDictionary *eventObject = [NSDictionary dictionaryWithObject:[[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding] forKey:@"data"];
    [self fireEvent:@"receiveddata" withObject:eventObject];
}

- (void)registerFailed:(NSError *)error {
    NSLog(@"Server registered failed: %@", error.localizedDescription);
}

- (void)serviceStopped:(NSString *)name {
    NSLog(@"Publish Stopped!");
    [self fireEvent:@"publishstopped" withObject:nil];
}

@end
