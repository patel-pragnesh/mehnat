//
//  ComCdnsolBonjourBrowserProxy.m
//  Bonjour
//
//  Created by VinayBhavsar on 30/07/18.
//

#import "ComCdnsolBonjourBrowserProxy.h"
#import "BSBonjourClient.h"
#import <TiUtils.h>

@interface ComCdnsolBonjourBrowserProxy () <BSBonjourClientDelegate>

@property (strong, nonatomic) BSBonjourClient *bonjourManager;
@property (nonatomic, strong) BSBonjourConnection *connection;

@end

@implementation ComCdnsolBonjourBrowserProxy

-(id)init
{
    self = [super init];
    if (self != nil) {
        self.bonjourManager = [[BSBonjourClient alloc] initWithServiceType:@"gongchacfd" transportProtocol:@"tcp" delegate:self];
    }
    return self;
}

#pragma Public APIs

- (void)startSearch:(id)args
{
    [self.bonjourManager startSearching];
}

- (void)stopSearch:(id)args
{
    [self.bonjourManager stopSearching];
}

- (void)connectToServiceAtIndex:(id)args
{
    NSInteger index = [TiUtils intValue:[args objectAtIndex:0]];
    NSLog(@"connectToServiceAtIndex is****= %d", index);
    [self.bonjourManager connectToServiceAtIndex:index];
     NSLog(@"connectToServiceAtIndex is****2= %d", index);
    
}

- (void)sendData:(id)args
{
    NSString *data = [TiUtils stringValue:[args objectAtIndex:0]];
    [self.bonjourManager sendData:[data dataUsingEncoding:NSUTF8StringEncoding]];
}

- (void)clearBuffer:(id)args
{
    if(self.connection != nil){
        [self.connection clearBuffer];
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

- (void)receivedData:(NSData *)data {
    NSDictionary *eventObject = [NSDictionary dictionaryWithObject:[[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding] forKey:@"data"];
    [self fireEvent:@"receiveddata" withObject:eventObject];
}

- (void)searchFailed:(NSError *)error {
    NSLog(@"Search encountered an error: %@", error.localizedDescription);
}

- (void)searchStarted {
    NSLog(@"Search Started!");
}

- (void)searchStopped {
    NSLog(@"Search Stopped!");
}

- (void)updateServiceList {
    NSMutableArray *servicesArr = [[NSMutableArray alloc] init];    
    for (NSNetService *service in [self.bonjourManager foundServices]) {
        NSMutableDictionary *serviceDict = [[NSMutableDictionary alloc] init];
        NSString* Identifier = [[[UIDevice currentDevice] identifierForVendor] UUIDString];
        
        NSString *perf_name = service.name;
        NSString *perf_id = [perf_name componentsSeparatedByString:@"_"][1];
        perf_name = [perf_name componentsSeparatedByString:@"_"][0];
        
//        [serviceDict setObject:service.name forKey:@"name"];
//        [serviceDict setObject:Identifier forKey:@"id"];
        [serviceDict setObject:perf_name forKey:@"name"];
        [serviceDict setObject:perf_id forKey:@"id"];
        [servicesArr addObject:serviceDict];
    }
    
    /*for (NSDictionary *dict in [self.bonjourManager foundServices]) {
        NSMutableDictionary *serviceDict = [[NSMutableDictionary alloc] init];
        NSString* Identifier = [[[UIDevice currentDevice] identifierForVendor] UUIDString];
     
     //        if ([dict valueForKey:@"Type"] != NSNotFound) {
        if([[dict valueForKey:@"type"] isEqualToString:@"Service"] ){
            NSString *perf_name = [dict valueForKey:@"name"];
            NSString *perf_id = [perf_name componentsSeparatedByString:@"_"][1];
            perf_name = [perf_name componentsSeparatedByString:@"_"][0];
            
            NSLog(@"ServiceName: %@",perf_name);
            NSLog(@"Service_UUID: %@",perf_id);
//            [serviceDict setObject:[dict valueForKey:@"name"] forKey:@"name"];
//            [serviceDict setObject:[dict valueForKey:@"perf_id"] forKey:@"perf_id"];
            [serviceDict setObject:perf_id forKey:@"id"];
            [serviceDict setObject:perf_name forKey:@"name"];
        }
     //        }
     
     
     
//        [serviceDict setObject:Identifier forKey:@"id"];
        [servicesArr addObject:serviceDict];
     }*/
    
    NSDictionary *eventObject = [NSDictionary dictionaryWithObject:servicesArr forKey:@"services"];
    [self fireEvent:@"updatedservices" withObject:eventObject];
}

@end
